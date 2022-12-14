const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const ENV = process.env.ENV || 'local'; // local/prod

const FONT_FOLDER = path.join((ENV === 'local' ? 'src' : 'dist'), 'assets');
const CANVAS_FONT_PATH = path.join(FONT_FOLDER, 'PlusJakartaSans-Bold.ttf');
const CANVAS_EMOJI_FONT_PATH = path.join(FONT_FOLDER, 'NotoColorEmoji.ttf');
const CANVAS_FALLBACK_FONT_PATH = path.join(FONT_FOLDER, 'DejaVuSans-Bold.ttf');

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
const IPNS_GATEWAY = 'https://ipfs.io/ipns/';

const SERVER_URL = ENV === 'local' ? `http://localhost:${PORT}` : `https://${HOST}`;
const ENS_APP_URL = process.env.ENS_APP_URL || 'https://app.dc.domains'

export {
  CANVAS_FONT_PATH,
  CANVAS_EMOJI_FONT_PATH,
  CANVAS_FALLBACK_FONT_PATH,
  IPFS_GATEWAY,
  IPNS_GATEWAY,
  SERVER_URL,
  ENS_APP_URL
};
