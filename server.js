if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-route');
const serve = require('koa-static');

// W3W Setup
const Geocoder = require('w3w-node-wrapper');
const w3w = new Geocoder({
  apiKey: process.env.W3WKEY
});

// Server
const PORT = process.env.PORT || 3000;
const app = new Koa();
const server = require('http').createServer(app.callback());
app.use(bodyParser());

// Socket.io Setup
const io = require('socket.io')(server);
io.on('connection', socket => {
  console.log('Client connected...');
  socket.on('disconnect', () => console.log('Client disconnected...'));
});

const w3wHandler = {
  process: async ctx => {
    try {
      let { words } = await ctx.request.body; // Get the three words in the phrase
      let w3wString = await words.split(' ').join('.'); // Join the words in the format expected by W3W
      const coords = await w3w.forward({ addr: w3wString }); // Get the coordinates from W3W
      ctx.body = { coords }; // Return 200, also the coordinates
      io.emit('newCoords', { coords }); // Emit the coords to the client side
    } catch (e) {
      ctx.status = 400; // If error, return bad request
      ctx.body = { error: e }; // Return exact error data
    }
  }
};

app.use(router.get('/', serve('static')));
app.use(router.post('/inbound', w3wHandler.process));
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
