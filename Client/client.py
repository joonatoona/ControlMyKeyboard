remoteEndpoint = "wss://digitalfishfun.com/keyctrl"

import razer.client as rc

import asyncio
import websockets

from json import loads

async def renderKeyboard(dat):
    for r, row in enumerate(dat):
        for c, col in enumerate(row):
            kb.fx.advanced.matrix[r, c] = col

    kb.fx.advanced.draw()

async def hello():
    async with websockets.connect(remoteEndpoint) as websocket:
        while True:
            msg = await websocket.recv()
            await renderKeyboard(loads(msg))

kb = rc.DeviceManager().devices[0]
print("Opened Keyboard")

asyncio.get_event_loop().run_until_complete(hello())