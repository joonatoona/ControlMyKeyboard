from keyboard import Keyboard
from json import loads, dumps
from uuid import uuid4
from time import time

kb = Keyboard()

import asyncio
import websockets

connections = {}
connectionLimit = {}
rateLimit = 10

async def sendAll():
    await asyncio.wait([c.send(dumps(kb.rows)) for c in list(connections.values())])

async def consumerHandle(websocket, uuid):
    while True:
        try:
            msg = await websocket.recv()
            if time() - connectionLimit[uuid] < rateLimit:
                continue
            connectionLimit[uuid] = time()
            dat = loads(msg)
            key = dat["key"]
            val = dat["val"]
            kb.setKey(key, val)
            await sendAll()
        except websockets.exceptions.ConnectionClosed:
            if uuid in connections:
                del connections[uuid]

async def producerHandle(websocket):
    while True:
        await asyncio.sleep(60)

async def handle(websocket, path):
    await websocket.send(dumps(kb.rows))
    uuid = uuid4()
    connections[uuid] = websocket
    connectionLimit[uuid] = 0

    consumer_task = asyncio.ensure_future(consumerHandle(websocket, uuid))
    producer_task = asyncio.ensure_future(producerHandle(websocket))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )

start_server = websockets.serve(handle, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()