/**
 * Anthology Provider: sinewix
 * Built from src/sinewix/index.js
 * Build: v1.8.30 (anthology build system)
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/shared/quality.js
var require_quality = __commonJS({
  "src/shared/quality.js"(exports2, module2) {
    function getQualityScore(s) {
      if (!s) return 0;
      if (!s.url) return 1;
      var q = ((s.quality || "") + " " + (s.title || "") + " " + (s.name || "")).toLowerCase();
      var score = 0;
      if (/\b(4k|2160p?|uhd)\b/.test(q)) score = 2160;
      else if (/\b(2k|1440p?|qhd)\b/.test(q)) score = 1440;
      else if (/\b(1080p?|fhd)\b/.test(q)) score = 1080;
      else if (/\b(720p?|hd)\b/.test(q)) score = 720;
      else if (/\b(540p?)\b/.test(q)) score = 540;
      else if (/\b(480p?|sd)\b/.test(q)) score = 480;
      else if (/\b(360p?)\b/.test(q)) score = 360;
      else if (/\b(240p?)\b/.test(q)) score = 240;
      if (score === 0 && s.title) {
        var text = s.title.toLowerCase();
        if (/\b(4k|2160p|uhd)\b/.test(text)) score = 2160;
        else if (/\b(2k|1440p|qhd)\b/.test(text)) score = 1440;
        else if (/\b(1080p|fhd)\b/.test(text)) score = 1080;
        else if (/\b(720p|hd)\b/.test(text)) score = 720;
        else if (/\b(480p|sd)\b/.test(text)) score = 480;
        else if (/\b(360p)\b/.test(text)) score = 360;
        else if (/\b(240p)\b/.test(text)) score = 240;
      }
      if (score === 0 && s.url) {
        var u = s.url.toLowerCase();
        if (/[\/_.-](2160p?|4k)[\/_.-]/.test(u)) score = 2160;
        else if (/[\/_.-](1440p?|2k)[\/_.-]/.test(u)) score = 1440;
        else if (/[\/_.-](1080p?|fhd)[\/_.-]/.test(u)) score = 1080;
        else if (/[\/_.-](720p?|hd)[\/_.-]/.test(u)) score = 720;
        else if (/[\/_.-](480p?|sd)[\/_.-]/.test(u)) score = 480;
        else if (/[\/_.-](360p?)[\/_.-]/.test(u)) score = 360;
      }
      var isDirectMp4 = s.format === "mp4" || s.type === "mp4" || !s.isHls && s.url && (s.url.endsWith(".mp4") || s.url.includes(".mp4?"));
      if (isDirectMp4 && score > 0) score += 1;
      return score;
    }
    function sortStreamsByQuality2(streams) {
      if (!Array.isArray(streams) || streams.length === 0) return streams;
      return streams.slice().sort(function(a, b) {
        return getQualityScore(b) - getQualityScore(a);
      });
    }
    module2.exports = {
      getQualityScore,
      sortStreamsByQuality: sortStreamsByQuality2
    };
  }
});

// src/shared/config.js
var require_config = __commonJS({
  "src/shared/config.js"(exports2, module2) {
    var CONFIG_URL = "https://raw.githubusercontent.com/falsisdev/anthology/main/config.json";
    var CONFIG_TTL_MS = 10 * 60 * 1e3;
    var _cfg = null;
    var _cfgTime = 0;
    function _cfgLocalRead() {
      try {
        if (typeof require === "undefined") return null;
        var fs = require("fs");
        var path = require("path");
        if (!fs || !path || typeof fs.existsSync !== "function") return null;
        var dir = typeof __dirname !== "undefined" ? __dirname : "";
        var candidates = [
          path.resolve(dir, "..", "config.json"),
          // providers/<name>.js
          path.resolve(dir, "..", "..", "config.json"),
          // src/<name>/index.js
          path.resolve(dir, "config.json")
        ];
        for (var i = 0; i < candidates.length; i++) {
          if (fs.existsSync(candidates[i])) {
            return JSON.parse(fs.readFileSync(candidates[i], "utf8"));
          }
        }
      } catch (e) {
        return null;
      }
      return null;
    }
    function _cfgFetch() {
      return fetch(CONFIG_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "application/json"
        }
      }).then(function(res) {
        if (!res || !res.ok) throw new Error("config.json " + (res && res.status));
        if (typeof res.json === "function") return res.json();
        return res.text().then(function(t) {
          return JSON.parse(t);
        });
      });
    }
    function loadConfig2() {
      var now = Date.now();
      if (_cfg && now - _cfgTime < CONFIG_TTL_MS) return Promise.resolve(_cfg);
      var local = _cfgLocalRead();
      if (local && typeof local === "object") {
        _cfg = local;
        _cfgTime = now;
        return Promise.resolve(_cfg);
      }
      return _cfgFetch().then(function(c) {
        _cfg = c && typeof c === "object" ? c : {};
        _cfgTime = now;
        return _cfg;
      }).catch(function() {
        _cfg = null;
        _cfgTime = now;
        return _cfg;
      });
    }
    function val2(pathStr) {
      if (!_cfg || !pathStr) return void 0;
      var parts = String(pathStr).split(".");
      var cur = _cfg;
      for (var i = 0; i < parts.length; i++) {
        if (cur == null || typeof cur !== "object") return void 0;
        cur = cur[parts[i]];
      }
      return cur;
    }
    function wrapAll2(obj, pre) {
      var out = {};
      for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          if (typeof obj[k] === "function") {
            (function(name, fn) {
              out[name] = function() {
                var self = this;
                var args = arguments;
                var chain = pre ? pre() : Promise.resolve();
                return chain.then(function() {
                  return fn.apply(self, args);
                });
              };
            })(k, obj[k]);
          } else {
            out[k] = obj[k];
          }
        }
      }
      return out;
    }
    if (typeof module2 !== "undefined" && module2.exports) {
      module2.exports = { loadConfig: loadConfig2, val: val2, wrapAll: wrapAll2 };
    }
  }
});

// node_modules/@noble/ciphers/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abool(value, title = "") {
  if (typeof value !== "boolean")
    throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
  return value;
}
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes(value, length, title = "") {
  if (isBytes(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber(length, "length");
  const bytes = isBytes(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function aoutput32(out, instance) {
  aoutput(out, instance);
  if (!isAligned32(out))
    throw new Error("invalid output, must be aligned");
}
function u8(arr) {
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function overlapBytes(a, b) {
  if (!a.byteLength || !b.byteLength)
    return false;
  return a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
  a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
  b.byteOffset < a.byteOffset + a.byteLength;
}
function complexOverlapBytes(input, output) {
  if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function equalBytes(a, b) {
  a = abytes(a);
  b = abytes(b);
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function wrapMacConstructor(keyLen, macCons, fromMsg) {
  const mac = macCons;
  const getArgs = fromMsg || (() => []);
  const macC = (msg, key) => mac(key, ...getArgs(msg)).update(msg).digest();
  const tmp = mac(new Uint8Array(keyLen), ...getArgs(new Uint8Array(0)));
  macC.outputLen = tmp.outputLen;
  macC.blockLen = tmp.blockLen;
  macC.create = (key, ...args) => mac(key, ...args);
  return macC;
}
function getOutput(expectedLength, out, onlyAligned = true) {
  if (out === void 0)
    return new Uint8Array(expectedLength);
  abytes(out, expectedLength, "output");
  if (onlyAligned && !isAligned32(out))
    throw new Error("invalid output, must be aligned");
  return out;
}
function u64Lengths(dataLength, aadLength, isLE2) {
  anumber(dataLength);
  anumber(aadLength);
  abool(isLE2);
  const num = new Uint8Array(16);
  const view = createView(num);
  view.setBigUint64(0, BigInt(aadLength), isLE2);
  view.setBigUint64(8, BigInt(dataLength), isLE2);
  return num;
}
function isAligned32(bytes) {
  return bytes.byteOffset % 4 === 0;
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes(bytes));
}
var atitle, isLE, swap8IfBE, swap32IfBE, wrapCipher;
var init_utils = __esm({
  "node_modules/@noble/ciphers/utils.js"() {
    atitle = (title) => title ? `"${title}" ` : "";
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n) >>> 0;
    swap32IfBE = isLE ? (u) => u : byteSwap32;
    wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
      function wrappedCipher(key, ...args) {
        abytes(key, void 0, "key");
        if (params.nonceLength !== void 0) {
          const nonce = args[0];
          abytes(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
        }
        const tagl = params.tagLength;
        const aadStart = params.nonceLength !== void 0 ? 1 : 0;
        if (!params.withAAD) {
          for (let i = aadStart; i < args.length; i++)
            if (isBytes(args[i]))
              throw new Error("AAD not supported");
        }
        if (params.withAAD && args[aadStart] !== void 0)
          abytes(args[aadStart], void 0, "AAD");
        const cipher = constructor(key, ...args);
        const checkOutput = (fnLength, output) => {
          if (output !== void 0) {
            if (fnLength !== 2)
              throw new Error("cipher output not supported");
            abytes(output, void 0, "output");
          }
        };
        let called = false;
        const wrCipher = {
          encrypt(data, output) {
            if (called)
              throw new Error("cannot encrypt() twice with same key + nonce");
            called = true;
            abytes(data, void 0, "data");
            checkOutput(cipher.encrypt.length, output);
            return cipher.encrypt(data, output);
          },
          decrypt(data, output) {
            abytes(data, void 0, "data");
            if (tagl && data.length < tagl)
              throw new Error('"ciphertext" expected length >= tagLength=' + tagl);
            checkOutput(cipher.decrypt.length, output);
            return cipher.decrypt(data, output);
          }
        };
        return wrCipher;
      }
      Object.assign(wrappedCipher, params);
      return wrappedCipher;
    };
  }
});

// node_modules/@noble/ciphers/_polyval.js
function _toGHASHKey(k) {
  k.reverse();
  const hiBit = k[15] & 1;
  let carry = 0;
  for (let i = 0; i < k.length; i++) {
    const t = k[i];
    k[i] = t >>> 1 | carry;
    carry = (t & 1) << 7;
  }
  k[0] ^= -hiBit & 225;
  return k;
}
var BLOCK_SIZE, ZEROS16, ZEROS32, POLY, mul2, swapLE, swap8IfLE, estimateWindow, GHASH, Polyval, ghash, polyval;
var init_polyval = __esm({
  "node_modules/@noble/ciphers/_polyval.js"() {
    init_utils();
    BLOCK_SIZE = 16;
    ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
    ZEROS32 = /* @__PURE__ */ u32(ZEROS16);
    POLY = 225;
    mul2 = (s0, s1, s2, s3) => {
      const hiBit = s3 & 1;
      return {
        s3: s2 << 31 | s3 >>> 1,
        s2: s1 << 31 | s2 >>> 1,
        s1: s0 << 31 | s1 >>> 1,
        // NIST SP 800-38D §6.3 applies `V >> 1` and XORs R on carry. In this
        // 4x32-bit split, R = 0xe1 || 0^120 lives in the top byte of s0.
        s0: s0 >>> 1 ^ POLY << 24 & -(hiBit & 1)
        // reduce % poly
      };
    };
    swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
    swap8IfLE = (n) => swap8IfBE(swapLE(n));
    estimateWindow = (bytes) => {
      if (bytes > 64 * 1024)
        return 8;
      if (bytes > 1024)
        return 4;
      return 2;
    };
    GHASH = class {
      // We select bits per window adaptively based on expectedLength
      constructor(key, expectedLength) {
        __publicField(this, "blockLen", BLOCK_SIZE);
        __publicField(this, "outputLen", BLOCK_SIZE);
        __publicField(this, "s0", 0);
        __publicField(this, "s1", 0);
        __publicField(this, "s2", 0);
        __publicField(this, "s3", 0);
        __publicField(this, "finished", false);
        __publicField(this, "destroyed", false);
        __publicField(this, "t");
        __publicField(this, "W");
        __publicField(this, "windowSize");
        abytes(key, 16, "key");
        key = copyBytes(key);
        const kView = createView(key);
        let k0 = kView.getUint32(0, false);
        let k1 = kView.getUint32(4, false);
        let k2 = kView.getUint32(8, false);
        let k3 = kView.getUint32(12, false);
        const doubles = [];
        for (let i = 0; i < 128; i++) {
          doubles.push({ s0: swapLE(k0), s1: swapLE(k1), s2: swapLE(k2), s3: swapLE(k3) });
          ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2(k0, k1, k2, k3));
        }
        const W = estimateWindow(expectedLength || 1024);
        if (![1, 2, 4, 8].includes(W))
          throw new Error("ghash: invalid window size, expected 2, 4 or 8");
        this.W = W;
        const bits = 128;
        const windows = bits / W;
        const windowSize = this.windowSize = 2 ** W;
        const items = [];
        for (let w = 0; w < windows; w++) {
          for (let byte = 0; byte < windowSize; byte++) {
            let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
            for (let j = 0; j < W; j++) {
              const bit = byte >>> W - j - 1 & 1;
              if (!bit)
                continue;
              const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
              s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
            }
            items.push({ s0, s1, s2, s3 });
          }
        }
        this.t = items;
      }
      _updateBlock(s0, s1, s2, s3) {
        s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
        const { W, t, windowSize } = this;
        let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
        const mask = (1 << W) - 1;
        let w = 0;
        for (const num of [s0, s1, s2, s3]) {
          for (let bytePos = 0; bytePos < 4; bytePos++) {
            const byte = num >>> 8 * bytePos & 255;
            for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
              const bit = byte >>> W * bitPos & mask;
              const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
              o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
              w += 1;
            }
          }
        }
        this.s0 = o0;
        this.s1 = o1;
        this.s2 = o2;
        this.s3 = o3;
      }
      update(data) {
        aexists(this);
        abytes(data);
        data = copyBytes(data);
        const b32 = u32(data);
        const blocks = Math.floor(data.length / BLOCK_SIZE);
        const left = data.length % BLOCK_SIZE;
        for (let i = 0; i < blocks; i++) {
          this._updateBlock(swap8IfBE(b32[i * 4 + 0]), swap8IfBE(b32[i * 4 + 1]), swap8IfBE(b32[i * 4 + 2]), swap8IfBE(b32[i * 4 + 3]));
        }
        if (left) {
          ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
          this._updateBlock(swap8IfBE(ZEROS32[0]), swap8IfBE(ZEROS32[1]), swap8IfBE(ZEROS32[2]), swap8IfBE(ZEROS32[3]));
          clean(ZEROS32);
        }
        return this;
      }
      destroy() {
        this.destroyed = true;
        const { t } = this;
        for (const elm of t) {
          elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
        }
      }
      digestInto(out) {
        aexists(this);
        aoutput32(out, this);
        this.finished = true;
        const { s0, s1, s2, s3 } = this;
        const o32 = u32(out);
        o32[0] = s0;
        o32[1] = s1;
        o32[2] = s2;
        o32[3] = s3;
        if (!isLE)
          swap32IfBE(o32.subarray(0, BLOCK_SIZE / 4));
      }
      digest() {
        const res = new Uint8Array(BLOCK_SIZE);
        this.digestInto(res);
        this.destroy();
        return res;
      }
    };
    Polyval = class extends GHASH {
      constructor(key, expectedLength) {
        abytes(key);
        const ghKey = _toGHASHKey(copyBytes(key));
        super(ghKey, expectedLength);
        clean(ghKey);
      }
      update(data) {
        aexists(this);
        abytes(data);
        data = copyBytes(data);
        const b32 = u32(data);
        const left = data.length % BLOCK_SIZE;
        const blocks = Math.floor(data.length / BLOCK_SIZE);
        for (let i = 0; i < blocks; i++) {
          this._updateBlock(swap8IfLE(b32[i * 4 + 3]), swap8IfLE(b32[i * 4 + 2]), swap8IfLE(b32[i * 4 + 1]), swap8IfLE(b32[i * 4 + 0]));
        }
        if (left) {
          ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
          this._updateBlock(swap8IfLE(ZEROS32[3]), swap8IfLE(ZEROS32[2]), swap8IfLE(ZEROS32[1]), swap8IfLE(ZEROS32[0]));
          clean(ZEROS32);
        }
        return this;
      }
      digestInto(out) {
        aexists(this);
        aoutput32(out, this);
        this.finished = true;
        const view = out.subarray(0, this.outputLen);
        const { s0, s1, s2, s3 } = this;
        const o32 = u32(view);
        o32[0] = s0;
        o32[1] = s1;
        o32[2] = s2;
        o32[3] = s3;
        swap32IfBE(o32);
        view.reverse();
      }
    };
    ghash = /* @__PURE__ */ wrapMacConstructor(16, (key, expectedLength) => new GHASH(key, expectedLength), (msg) => [msg.length]);
    polyval = /* @__PURE__ */ wrapMacConstructor(16, (key, expectedLength) => new Polyval(key, expectedLength), (msg) => [msg.length]);
  }
});

// node_modules/@noble/ciphers/aes.js
var aes_exports = {};
__export(aes_exports, {
  __TESTS: () => __TESTS,
  aeskw: () => aeskw,
  aeskwp: () => aeskwp,
  aessiv: () => aessiv2,
  cbc: () => cbc,
  cfb: () => cfb,
  cmac: () => cmac,
  ctr: () => ctr,
  ecb: () => ecb,
  gcm: () => gcm,
  gcmsiv: () => gcmsiv,
  rngAesCtrDrbg128: () => rngAesCtrDrbg128,
  rngAesCtrDrbg256: () => rngAesCtrDrbg256,
  siv: () => siv,
  unsafe: () => unsafe
});
function validateKeyLength(key) {
  if (![16, 24, 32].includes(key.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + key.length);
}
function mul22(n) {
  return n << 1 ^ POLY2 & -(n >> 7);
}
function mul(a, b) {
  let res = 0;
  for (; b > 0; b >>= 1) {
    res ^= a & -(b & 1);
    a = mul22(a);
  }
  return res;
}
function genTtable(sbox2, fn) {
  if (sbox2.length !== 256)
    throw new Error("wrong sbox length");
  const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
  const T1 = T0.map(rotl32_8);
  const T2 = T1.map(rotl32_8);
  const T3 = T2.map(rotl32_8);
  const T01 = new Uint32Array(256 * 256);
  const T23 = new Uint32Array(256 * 256);
  const sbox22 = new Uint16Array(256 * 256);
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
      const idx = i * 256 + j;
      T01[idx] = T0[i] ^ T1[j];
      T23[idx] = T2[i] ^ T3[j];
      sbox22[idx] = sbox2[i] << 8 | sbox2[j];
    }
  }
  return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
}
function expandKeyLE(key) {
  abytes(key);
  const len = key.length;
  validateKeyLength(key);
  const { sbox2 } = tableEncoding;
  const toClean = [];
  if (!isLE || !isAligned32(key))
    toClean.push(key = copyBytes(key));
  const k32 = swap32IfBE(u32(key));
  const Nk = k32.length;
  const subByte = (n) => applySbox(sbox2, n, n, n, n);
  const xk = new Uint32Array(len + 28);
  xk.set(k32);
  for (let i = Nk; i < xk.length; i++) {
    let t = xk[i - 1];
    if (i % Nk === 0)
      t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
    else if (Nk > 6 && i % Nk === 4)
      t = subByte(t);
    xk[i] = xk[i - Nk] ^ t;
  }
  clean(...toClean);
  return xk;
}
function expandKeyDecLE(key) {
  const encKey = expandKeyLE(key);
  const xk = encKey.slice();
  const Nk = encKey.length;
  const { sbox2 } = tableEncoding;
  const { T0, T1, T2, T3 } = tableDecoding;
  for (let i = 0; i < Nk; i += 4) {
    for (let j = 0; j < 4; j++)
      xk[i + j] = encKey[Nk - i - 4 + j];
  }
  clean(encKey);
  for (let i = 4; i < Nk - 4; i++) {
    const x = xk[i];
    const w = applySbox(sbox2, x, x, x, x);
    xk[i] = T0[w & 255] ^ T1[w >>> 8 & 255] ^ T2[w >>> 16 & 255] ^ T3[w >>> 24];
  }
  return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
  return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
}
function applySbox(sbox2, s0, s1, s2, s3) {
  return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
}
function encrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableEncoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function decrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableDecoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function ctrCounter(xk, nonce, src, dst) {
  abytes(nonce, BLOCK_SIZE2, "nonce");
  abytes(src);
  const srcLen = src.length;
  dst = getOutput(srcLen, dst);
  complexOverlapBytes(src, dst);
  const ctr2 = nonce;
  const c32 = u32(ctr2);
  const src32 = u32(src);
  const dst32 = u32(dst);
  for (let i = 0; i + 4 <= src32.length; i += 4) {
    const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
    dst32[i + 0] = src32[i + 0] ^ swap8IfBE(s0);
    dst32[i + 1] = src32[i + 1] ^ swap8IfBE(s1);
    dst32[i + 2] = src32[i + 2] ^ swap8IfBE(s2);
    dst32[i + 3] = src32[i + 3] ^ swap8IfBE(s3);
    for (let j = BLOCK_SIZE2 - 1, carry = 1; j >= 0; j--) {
      carry = carry + ctr2[j] | 0;
      ctr2[j] = carry & 255;
      carry >>>= 8;
    }
  }
  const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
  if (start < srcLen) {
    const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
    const b32 = new Uint32Array([s0, s1, s2, s3]);
    swap32IfBE(b32);
    const buf = u8(b32);
    for (let i = start, pos = 0; i < srcLen; i++, pos++)
      dst[i] = src[i] ^ buf[pos];
    clean(b32);
  }
  return dst;
}
function ctr32(xk, isLE2, nonce, src, dst) {
  abytes(nonce, BLOCK_SIZE2, "nonce");
  abytes(src);
  dst = getOutput(src.length, dst);
  const ctr2 = nonce;
  const c32 = u32(ctr2);
  const view = createView(ctr2);
  const src32 = u32(src);
  const dst32 = u32(dst);
  const ctrPos = isLE2 ? 0 : 12;
  const srcLen = src.length;
  let ctrNum = view.getUint32(ctrPos, isLE2);
  for (let i = 0; i + 4 <= src32.length; i += 4) {
    const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
    dst32[i + 0] = src32[i + 0] ^ swap8IfBE(s0);
    dst32[i + 1] = src32[i + 1] ^ swap8IfBE(s1);
    dst32[i + 2] = src32[i + 2] ^ swap8IfBE(s2);
    dst32[i + 3] = src32[i + 3] ^ swap8IfBE(s3);
    ctrNum = ctrNum + 1 >>> 0;
    view.setUint32(ctrPos, ctrNum, isLE2);
  }
  const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
  if (start < srcLen) {
    const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
    const b32 = new Uint32Array([s0, s1, s2, s3]);
    swap32IfBE(b32);
    const buf = u8(b32);
    for (let i = start, pos = 0; i < srcLen; i++, pos++)
      dst[i] = src[i] ^ buf[pos];
    clean(b32);
  }
  return dst;
}
function validateBlockDecrypt(data, dst) {
  abytes(data);
  if (data.length % BLOCK_SIZE2 !== 0) {
    throw new Error("ciphertext must be multiple of " + BLOCK_SIZE2);
  }
  if (dst !== void 0) {
    getOutput(data.length, dst);
    complexOverlapBytes(data, dst);
  }
}
function validateBlockEncrypt(plaintext, pkcs5, dst) {
  abytes(plaintext);
  let outLen = plaintext.length;
  const remaining = outLen % BLOCK_SIZE2;
  if (!pkcs5 && remaining !== 0)
    throw new Error("plaintext must be multiple of " + BLOCK_SIZE2);
  if (pkcs5) {
    let left = BLOCK_SIZE2 - remaining;
    if (!left)
      left = BLOCK_SIZE2;
    outLen = outLen + left;
  }
  if (dst !== void 0) {
    getOutput(outLen, dst);
    complexOverlapBytes(plaintext, dst);
  }
  return outLen;
}
function prepareBlockEncrypt(plaintext, outLen, dst) {
  if (dst === void 0)
    dst = new Uint8Array(outLen);
  if (!isLE || !isAligned32(plaintext))
    plaintext = copyBytes(plaintext);
  const o = u32(dst);
  return { b: plaintext, o, out: dst };
}
function validatePKCS(data, pkcs5) {
  if (!pkcs5)
    return data;
  const len = data.length;
  if (len === 0)
    throw new Error("pkcs7: empty ciphertext not allowed");
  const lastByte = data[len - 1];
  let valid = 1;
  valid &= lastByte - 1 >>> 31 ^ 1;
  valid &= 16 - lastByte >>> 31 ^ 1;
  for (let i = 0; i < 16; i++) {
    const shouldCheck = i - lastByte >>> 31;
    const eq = (data[len - 1 - i] ^ lastByte) === 0 ? 1 : 0;
    valid &= eq | shouldCheck ^ 1;
  }
  if (!valid)
    throw new Error("aes: bad decrypt");
  return data.subarray(0, len - lastByte);
}
function padPCKS(left) {
  const tmp = new Uint8Array(16);
  const tmp32 = u32(tmp);
  tmp.set(left);
  const paddingByte = BLOCK_SIZE2 - left.length;
  for (let i = BLOCK_SIZE2 - paddingByte; i < BLOCK_SIZE2; i++)
    tmp[i] = paddingByte;
  return tmp32;
}
function computeTag(fn, isLE2, key, data, AAD) {
  const aadLength = AAD ? AAD.length : 0;
  const h = fn.create(key, data.length + aadLength);
  if (AAD)
    h.update(AAD);
  const num = u64Lengths(8 * data.length, 8 * aadLength, isLE2);
  h.update(data);
  h.update(num);
  const res = h.digest();
  clean(num);
  return res;
}
function isBytes32(a) {
  return a instanceof Uint32Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint32Array";
}
function encryptBlock(xk, block) {
  abytes(block, 16, "block");
  if (!isBytes32(xk))
    throw new Error("_encryptBlock accepts result of expandKeyLE");
  const b32 = u32(block);
  swap32IfBE(b32);
  let { s0, s1, s2, s3 } = encrypt(xk, b32[0], b32[1], b32[2], b32[3]);
  b32[0] = s0, b32[1] = s1, b32[2] = s2, b32[3] = s3;
  swap32IfBE(b32);
  return block;
}
function decryptBlock(xk, block) {
  abytes(block, 16, "block");
  if (!isBytes32(xk))
    throw new Error("_decryptBlock accepts result of expandKeyLE");
  const b32 = u32(block);
  swap32IfBE(b32);
  let { s0, s1, s2, s3 } = decrypt(xk, b32[0], b32[1], b32[2], b32[3]);
  b32[0] = s0, b32[1] = s1, b32[2] = s2, b32[3] = s3;
  swap32IfBE(b32);
  return block;
}
function dbl(block) {
  let carry = 0;
  for (let i = BLOCK_SIZE2 - 1; i >= 0; i--) {
    const newCarry = (block[i] & 128) >>> 7;
    block[i] = block[i] << 1 | carry;
    carry = newCarry;
  }
  block[BLOCK_SIZE2 - 1] ^= 135 & -carry;
  return block;
}
function xorBlock(a, b) {
  if (a.length !== b.length)
    throw new Error("xorBlock: blocks must have same length");
  for (let i = 0; i < a.length; i++) {
    a[i] = a[i] ^ b[i];
  }
  return a;
}
function xorend(a, b) {
  if (b.length > a.length) {
    throw new Error("xorend: expected len(B) <= len(A)");
  }
  const offset = a.length - b.length;
  for (let i = 0; i < b.length; i++) {
    a[offset + i] = a[offset + i] ^ b[i];
  }
  return a;
}
function s2v(key, strings) {
  validateKeyLength(key);
  const len = strings.length;
  if (len > 127) {
    throw new Error("s2v: expected <= 127 inputs");
  }
  if (len === 0)
    return cmac(ONE_BLOCK, key);
  let d = cmac(EMPTY_BLOCK, key);
  for (let i = 0; i < len - 1; i++) {
    dbl(d);
    const cmacResult = cmac(strings[i], key);
    xorBlock(d, cmacResult);
    clean(cmacResult);
  }
  const s_n = strings[len - 1];
  abytes(s_n);
  let t;
  if (s_n.byteLength >= BLOCK_SIZE2) {
    t = xorend(Uint8Array.from(s_n), d);
  } else {
    const paddedSn = new Uint8Array(BLOCK_SIZE2);
    paddedSn.set(s_n);
    paddedSn[s_n.length] = 128;
    t = xorBlock(dbl(d), paddedSn);
    clean(paddedSn);
  }
  const result = cmac(t, key);
  clean(d, t);
  return result;
}
var BLOCK_SIZE2, BLOCK_SIZE32, EMPTY_BLOCK, ONE_BLOCK, POLY2, incBytes, sbox, invSbox, rotr32_8, rotl32_8, tableEncoding, tableDecoding, xPowers, ctr, ecb, cbc, cfb, gcm, limit, gcmsiv, AESW, AESKW_IV, aeskw, AESKWP_IV, aeskwp, _AesCtrDRBG, createAesDrbg, rngAesCtrDrbg128, rngAesCtrDrbg256, _CMAC, cmac, siv, aessiv2, unsafe, __TESTS;
var init_aes = __esm({
  "node_modules/@noble/ciphers/aes.js"() {
    init_polyval();
    init_utils();
    BLOCK_SIZE2 = 16;
    BLOCK_SIZE32 = 4;
    EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE2);
    ONE_BLOCK = /* @__PURE__ */ Uint8Array.from([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1
    ]);
    POLY2 = 283;
    incBytes = (data, isLE2, carry = 1) => {
      if (!Number.isSafeInteger(carry) || carry < 0 || carry > 4294967040)
        throw new Error("incBytes: wrong carry " + carry);
      abytes(data);
      for (let i = 0; i < data.length; i++) {
        const pos = !isLE2 ? data.length - 1 - i : i;
        carry = carry + (data[pos] & 255) | 0;
        data[pos] = carry & 255;
        carry >>>= 8;
      }
    };
    sbox = /* @__PURE__ */ (() => {
      const t = new Uint8Array(256);
      for (let i = 0, x = 1; i < 256; i++, x ^= mul22(x))
        t[i] = x;
      const box = new Uint8Array(256);
      box[0] = 99;
      for (let i = 0; i < 255; i++) {
        let x = t[255 - i];
        x |= x << 8;
        box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
      }
      clean(t);
      return box;
    })();
    invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
    rotr32_8 = (n) => n << 24 | n >>> 8;
    rotl32_8 = (n) => n << 8 | n >>> 24;
    tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
    tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => mul(s, 11) << 24 | mul(s, 13) << 16 | mul(s, 9) << 8 | mul(s, 14));
    xPowers = /* @__PURE__ */ (() => {
      const p = new Uint8Array(16);
      for (let i = 0, x = 1; i < 16; i++, x = mul22(x))
        p[i] = x;
      return p;
    })();
    ctr = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, function aesctr(key, nonce) {
      function processCtr(buf, dst) {
        abytes(buf);
        if (dst !== void 0) {
          abytes(dst);
          if (!isAligned32(dst))
            throw new Error("unaligned destination");
        }
        const xk = expandKeyLE(key);
        const n = copyBytes(nonce);
        const toClean = [xk, n];
        if (!isAligned32(buf))
          toClean.push(buf = copyBytes(buf));
        const out = ctrCounter(xk, n, buf, dst);
        clean(...toClean);
        return out;
      }
      return {
        encrypt: (plaintext, dst) => processCtr(plaintext, dst),
        decrypt: (ciphertext, dst) => processCtr(ciphertext, dst)
      };
    });
    ecb = /* @__PURE__ */ wrapCipher({ blockSize: 16 }, function aesecb(key, opts = {}) {
      const pkcs5 = !opts.disablePadding;
      return {
        encrypt(plaintext, dst) {
          const outLen = validateBlockEncrypt(plaintext, pkcs5, dst);
          const xk = expandKeyLE(key);
          const { b: input, o, out: _out } = prepareBlockEncrypt(plaintext, outLen, dst);
          const b = u32(input);
          swap32IfBE(b);
          let i = 0;
          for (; i + 4 <= b.length; ) {
            const { s0, s1, s2, s3 } = encrypt(xk, b[i + 0], b[i + 1], b[i + 2], b[i + 3]);
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
          }
          if (pkcs5) {
            const tmp32 = padPCKS(plaintext.subarray(i * 4));
            swap32IfBE(tmp32);
            const { s0, s1, s2, s3 } = encrypt(xk, tmp32[0], tmp32[1], tmp32[2], tmp32[3]);
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
            clean(tmp32);
          }
          swap32IfBE(o);
          clean(xk);
          if (input !== plaintext)
            clean(input);
          return _out;
        },
        decrypt(ciphertext, dst) {
          validateBlockDecrypt(ciphertext, dst);
          const xk = expandKeyDecLE(key);
          if (dst === void 0)
            dst = new Uint8Array(ciphertext.length);
          const toClean = [xk];
          if (!isLE || !isAligned32(ciphertext))
            toClean.push(ciphertext = copyBytes(ciphertext));
          const b = u32(ciphertext);
          const o = u32(dst);
          swap32IfBE(b);
          for (let i = 0; i + 4 <= b.length; ) {
            const { s0, s1, s2, s3 } = decrypt(xk, b[i + 0], b[i + 1], b[i + 2], b[i + 3]);
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
          }
          swap32IfBE(o);
          clean(...toClean);
          return validatePKCS(dst, pkcs5);
        }
      };
    });
    cbc = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, function aescbc(key, iv, opts = {}) {
      const pkcs5 = !opts.disablePadding;
      return {
        encrypt(plaintext, dst) {
          const outLen = validateBlockEncrypt(plaintext, pkcs5, dst);
          const xk = expandKeyLE(key);
          const { b: input, o, out: _out } = prepareBlockEncrypt(plaintext, outLen, dst);
          const b = u32(input);
          swap32IfBE(b);
          let _iv = iv;
          const toClean = [xk];
          if (!isLE || !isAligned32(_iv))
            toClean.push(_iv = copyBytes(_iv));
          const n32 = u32(_iv);
          swap32IfBE(n32);
          let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
          let i = 0;
          for (; i + 4 <= b.length; ) {
            s0 ^= b[i + 0], s1 ^= b[i + 1], s2 ^= b[i + 2], s3 ^= b[i + 3];
            ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
          }
          if (pkcs5) {
            const tmp32 = padPCKS(plaintext.subarray(i * 4));
            swap32IfBE(tmp32);
            s0 ^= tmp32[0], s1 ^= tmp32[1], s2 ^= tmp32[2], s3 ^= tmp32[3];
            ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
            clean(tmp32);
          }
          swap32IfBE(o);
          clean(...toClean);
          if (input !== plaintext)
            clean(input);
          return _out;
        },
        decrypt(ciphertext, dst) {
          validateBlockDecrypt(ciphertext, dst);
          const xk = expandKeyDecLE(key);
          if (dst === void 0)
            dst = new Uint8Array(ciphertext.length);
          let _iv = iv;
          const toClean = [xk];
          if (!isLE || !isAligned32(_iv))
            toClean.push(_iv = copyBytes(_iv));
          const n32 = u32(_iv);
          swap32IfBE(n32);
          if (!isLE || !isAligned32(ciphertext))
            toClean.push(ciphertext = copyBytes(ciphertext));
          const b = u32(ciphertext);
          const o = u32(dst);
          swap32IfBE(b);
          let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
          for (let i = 0; i + 4 <= b.length; ) {
            const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
            s0 = b[i + 0], s1 = b[i + 1], s2 = b[i + 2], s3 = b[i + 3];
            const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
            o[i++] = o0 ^ ps0, o[i++] = o1 ^ ps1, o[i++] = o2 ^ ps2, o[i++] = o3 ^ ps3;
          }
          swap32IfBE(o);
          clean(...toClean);
          return validatePKCS(dst, pkcs5);
        }
      };
    });
    cfb = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, function aescfb(key, iv) {
      function processCfb(src, isEncrypt, dst) {
        abytes(src);
        const srcLen = src.length;
        dst = getOutput(srcLen, dst);
        if (overlapBytes(src, dst))
          throw new Error("overlapping src and dst not supported");
        const xk = expandKeyLE(key);
        let _iv = iv;
        const toClean = [xk];
        if (!isLE || !isAligned32(_iv))
          toClean.push(_iv = copyBytes(_iv));
        if (!isLE || !isAligned32(src))
          toClean.push(src = copyBytes(src));
        const src32 = u32(src);
        const dst32 = u32(dst);
        const next32 = isEncrypt ? dst32 : src32;
        const n32 = u32(_iv);
        swap32IfBE(src32);
        swap32IfBE(n32);
        let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
        for (let i = 0; i + 4 <= src32.length; ) {
          const { s0: e0, s1: e1, s2: e2, s3: e3 } = encrypt(xk, s0, s1, s2, s3);
          dst32[i + 0] = src32[i + 0] ^ e0;
          dst32[i + 1] = src32[i + 1] ^ e1;
          dst32[i + 2] = src32[i + 2] ^ e2;
          dst32[i + 3] = src32[i + 3] ^ e3;
          s0 = next32[i++], s1 = next32[i++], s2 = next32[i++], s3 = next32[i++];
        }
        const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
        if (start < srcLen) {
          if (!isLE)
            swap32IfBE(src32.subarray(start / 4));
          ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
          const tmp = new Uint32Array([s0, s1, s2, s3]);
          swap32IfBE(tmp);
          const buf = u8(tmp);
          for (let i = start, pos = 0; i < srcLen; i++, pos++)
            dst[i] = src[i] ^ buf[pos];
          clean(buf);
        }
        if (!isLE)
          swap32IfBE(dst32.subarray(0, start / 4));
        clean(...toClean);
        return dst;
      }
      return {
        encrypt: (plaintext, dst) => processCfb(plaintext, true, dst),
        decrypt: (ciphertext, dst) => processCfb(ciphertext, false, dst)
      };
    });
    gcm = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 12, tagLength: 16, withAAD: true, varSizeNonce: true }, function aesgcm(key, nonce, AAD) {
      if (nonce.length < 8)
        throw new Error("aes/gcm: invalid nonce length");
      const tagLength = 16;
      function _computeTag(authKey, tagMask, data) {
        const tag = computeTag(ghash, false, authKey, data, AAD);
        for (let i = 0; i < tagMask.length; i++)
          tag[i] ^= tagMask[i];
        return tag;
      }
      function deriveKeys() {
        const xk = expandKeyLE(key);
        const authKey = EMPTY_BLOCK.slice();
        const counter = EMPTY_BLOCK.slice();
        ctr32(xk, false, counter, counter, authKey);
        if (nonce.length === 12) {
          counter.set(nonce);
        } else {
          const nonceLen = EMPTY_BLOCK.slice();
          const view = createView(nonceLen);
          view.setBigUint64(8, BigInt(nonce.length * 8), false);
          const g = ghash.create(authKey).update(nonce).update(nonceLen);
          g.digestInto(counter);
          g.destroy();
        }
        const tagMask = ctr32(xk, false, counter, EMPTY_BLOCK);
        return { xk, authKey, counter, tagMask };
      }
      return {
        encrypt(plaintext) {
          const { xk, authKey, counter, tagMask } = deriveKeys();
          const out = new Uint8Array(plaintext.length + tagLength);
          const toClean = [xk, authKey, counter, tagMask];
          if (!isAligned32(plaintext))
            toClean.push(plaintext = copyBytes(plaintext));
          ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
          const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
          toClean.push(tag);
          out.set(tag, plaintext.length);
          clean(...toClean);
          return out;
        },
        decrypt(ciphertext) {
          const { xk, authKey, counter, tagMask } = deriveKeys();
          const toClean = [xk, authKey, tagMask, counter];
          if (!isAligned32(ciphertext))
            toClean.push(ciphertext = copyBytes(ciphertext));
          const data = ciphertext.subarray(0, -tagLength);
          const passedTag = ciphertext.subarray(-tagLength);
          const tag = _computeTag(authKey, tagMask, data);
          toClean.push(tag);
          if (!equalBytes(tag, passedTag)) {
            clean(...toClean);
            throw new Error("aes-gcm: invalid tag");
          }
          const out = ctr32(xk, false, counter, data);
          clean(...toClean);
          return out;
        }
      };
    });
    limit = (name, min, max) => (value) => {
      if (!Number.isSafeInteger(value) || min > value || value > max) {
        const minmax = "[" + min + ".." + max + "]";
        throw new Error("" + name + ": expected value in range " + minmax + ", got " + value);
      }
    };
    gcmsiv = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 12, tagLength: 16, withAAD: true, varSizeNonce: true }, function aessiv(key, nonce, AAD) {
      const tagLength = 16;
      const AAD_LIMIT = limit("AAD", 0, 2 ** 36);
      const PLAIN_LIMIT = limit("plaintext", 0, 2 ** 36);
      const NONCE_LIMIT = limit("nonce", 12, 12);
      const CIPHER_LIMIT = limit("ciphertext", 16, 2 ** 36 + 16);
      abytes(key);
      validateKeyLength(key);
      NONCE_LIMIT(nonce.length);
      if (AAD !== void 0)
        AAD_LIMIT(AAD.length);
      function deriveKeys() {
        const xk = expandKeyLE(key);
        const encKey = new Uint8Array(key.length);
        const authKey = new Uint8Array(16);
        const toClean = [xk, encKey];
        let _nonce = nonce;
        if (!isLE || !isAligned32(_nonce))
          toClean.push(_nonce = copyBytes(_nonce));
        const n32 = u32(_nonce);
        swap32IfBE(n32);
        let s0 = 0, s1 = n32[0], s2 = n32[1], s3 = n32[2];
        let counter = 0;
        for (const derivedKey of [authKey, encKey].map(u32)) {
          const d32 = u32(derivedKey);
          for (let i = 0; i < d32.length; i += 2) {
            const { s0: o0, s1: o1 } = encrypt(xk, s0, s1, s2, s3);
            d32[i + 0] = o0;
            d32[i + 1] = o1;
            s0 = ++counter;
          }
          swap32IfBE(d32);
        }
        const res = { authKey, encKey: expandKeyLE(encKey) };
        clean(...toClean);
        return res;
      }
      function _computeTag(encKey, authKey, data) {
        const tag = computeTag(polyval, true, authKey, data, AAD);
        for (let i = 0; i < 12; i++)
          tag[i] ^= nonce[i];
        tag[15] &= 127;
        const t32 = u32(tag);
        swap32IfBE(t32);
        let s0 = t32[0], s1 = t32[1], s2 = t32[2], s3 = t32[3];
        ({ s0, s1, s2, s3 } = encrypt(encKey, s0, s1, s2, s3));
        t32[0] = s0, t32[1] = s1, t32[2] = s2, t32[3] = s3;
        swap32IfBE(t32);
        return tag;
      }
      function processSiv(encKey, tag, input) {
        let block = copyBytes(tag);
        block[15] |= 128;
        const res = ctr32(encKey, true, block, input);
        clean(block);
        return res;
      }
      return {
        encrypt(plaintext) {
          PLAIN_LIMIT(plaintext.length);
          const { encKey, authKey } = deriveKeys();
          const tag = _computeTag(encKey, authKey, plaintext);
          const toClean = [encKey, authKey, tag];
          if (!isAligned32(plaintext))
            toClean.push(plaintext = copyBytes(plaintext));
          const out = new Uint8Array(plaintext.length + tagLength);
          out.set(tag, plaintext.length);
          out.set(processSiv(encKey, tag, plaintext));
          clean(...toClean);
          return out;
        },
        decrypt(ciphertext) {
          CIPHER_LIMIT(ciphertext.length);
          const tag = ciphertext.subarray(-tagLength);
          const { encKey, authKey } = deriveKeys();
          const toClean = [encKey, authKey];
          if (!isAligned32(ciphertext))
            toClean.push(ciphertext = copyBytes(ciphertext));
          const plaintext = processSiv(encKey, tag, ciphertext.subarray(0, -tagLength));
          const expectedTag = _computeTag(encKey, authKey, plaintext);
          toClean.push(expectedTag);
          if (!equalBytes(tag, expectedTag)) {
            clean(plaintext, ...toClean);
            throw new Error("invalid polyval tag");
          }
          clean(...toClean);
          return plaintext;
        }
      };
    });
    AESW = {
      /*
      High-level pseudocode:
      ```
      A: u64 = IV
      out = []
      for (let i=0, ctr = 0; i<6; i++) {
        for (const chunk of chunks(plaintext, 8)) {
          A ^= swapEndianess(ctr++)
          [A, res] = chunks(encrypt(A || chunk), 8);
          out ||= res
        }
      }
      out = A || out
      ```
      Decrypt is the same, but reversed.
      */
      encrypt(kek, out) {
        if (out.length >= 2 ** 32)
          throw new Error("plaintext should be less than 4gb");
        const xk = expandKeyLE(kek);
        if (out.length === 16)
          encryptBlock(xk, out);
        else {
          const o32 = u32(out);
          swap32IfBE(o32);
          let a0 = o32[0], a1 = o32[1];
          for (let j = 0, ctr2 = 1; j < 6; j++) {
            for (let pos = 2; pos < o32.length; pos += 2, ctr2++) {
              const { s0, s1, s2, s3 } = encrypt(xk, a0, a1, o32[pos], o32[pos + 1]);
              a0 = s0, a1 = s1 ^ byteSwap(ctr2), o32[pos] = s2, o32[pos + 1] = s3;
            }
          }
          o32[0] = a0, o32[1] = a1;
          swap32IfBE(o32);
        }
        xk.fill(0);
      },
      decrypt(kek, out) {
        if (out.length - 8 >= 2 ** 32)
          throw new Error("ciphertext should be less than 4gb");
        const xk = expandKeyDecLE(kek);
        const chunks = out.length / 8 - 1;
        if (chunks === 1)
          decryptBlock(xk, out);
        else {
          const o32 = u32(out);
          swap32IfBE(o32);
          let a0 = o32[0], a1 = o32[1];
          for (let j = 0, ctr2 = chunks * 6; j < 6; j++) {
            for (let pos = chunks * 2; pos >= 1; pos -= 2, ctr2--) {
              a1 ^= byteSwap(ctr2);
              const { s0, s1, s2, s3 } = decrypt(xk, a0, a1, o32[pos], o32[pos + 1]);
              a0 = s0, a1 = s1, o32[pos] = s2, o32[pos + 1] = s3;
            }
          }
          o32[0] = a0, o32[1] = a1;
          swap32IfBE(o32);
        }
        xk.fill(0);
      }
    };
    AESKW_IV = /* @__PURE__ */ new Uint8Array(8).fill(166);
    aeskw = /* @__PURE__ */ wrapCipher({ blockSize: 8 }, (kek) => ({
      encrypt(plaintext) {
        if (!plaintext.length || plaintext.length % 8 !== 0)
          throw new Error("invalid plaintext length");
        if (plaintext.length === 8)
          throw new Error("8-byte keys not allowed, use AESKWP");
        const out = concatBytes(AESKW_IV, plaintext);
        AESW.encrypt(kek, out);
        return out;
      },
      decrypt(ciphertext) {
        if (ciphertext.length % 8 !== 0 || ciphertext.length < 3 * 8)
          throw new Error("invalid ciphertext length");
        const out = copyBytes(ciphertext);
        AESW.decrypt(kek, out);
        if (!equalBytes(out.subarray(0, 8), AESKW_IV))
          throw new Error("integrity check failed");
        out.subarray(0, 8).fill(0);
        return out.subarray(8);
      }
    }));
    AESKWP_IV = 2790873510;
    aeskwp = /* @__PURE__ */ wrapCipher({ blockSize: 8 }, (kek) => ({
      encrypt(plaintext) {
        if (!plaintext.length)
          throw new Error("invalid plaintext length");
        const padded = Math.ceil(plaintext.length / 8) * 8;
        const out = new Uint8Array(8 + padded);
        out.set(plaintext, 8);
        const out32 = u32(out);
        out32[0] = swap8IfBE(AESKWP_IV);
        out32[1] = swap8IfBE(byteSwap(plaintext.length));
        AESW.encrypt(kek, out);
        return out;
      },
      decrypt(ciphertext) {
        if (ciphertext.length < 16)
          throw new Error("invalid ciphertext length");
        const out = copyBytes(ciphertext);
        const o32 = u32(out);
        AESW.decrypt(kek, out);
        const len = byteSwap(swap8IfBE(o32[1])) >>> 0;
        const padded = Math.ceil(len / 8) * 8;
        if (swap8IfBE(o32[0]) !== AESKWP_IV || out.length - 8 !== padded)
          throw new Error("integrity check failed");
        for (let i = len; i < padded; i++)
          if (out[8 + i] !== 0)
            throw new Error("integrity check failed");
        out.subarray(0, 8).fill(0);
        return out.subarray(8, 8 + len);
      }
    }));
    _AesCtrDRBG = class {
      constructor(keyLen, seed, personalization) {
        __publicField(this, "blockLen");
        __publicField(this, "key");
        __publicField(this, "nonce");
        __publicField(this, "state");
        __publicField(this, "reseedCnt");
        __publicField(this, "destroyed", false);
        this.blockLen = ctr.blockSize;
        const keyLenBytes = keyLen / 8;
        const nonceLen = 16;
        this.state = new Uint8Array(keyLenBytes + nonceLen);
        this.key = this.state.subarray(0, keyLenBytes);
        this.nonce = this.state.subarray(keyLenBytes, keyLenBytes + nonceLen);
        this.reseedCnt = 1;
        incBytes(this.nonce, false, 1);
        this.addEntropy(seed, personalization);
      }
      update(data) {
        ctr(this.key, this.nonce).encrypt(new Uint8Array(this.state.length), this.state);
        if (data) {
          abytes(data);
          for (let i = 0; i < data.length; i++)
            this.state[i] ^= data[i];
        }
        incBytes(this.nonce, false, 1);
      }
      // Optional `info` is additional input XORed into the reseed block and is
      // limited to the internal state width.
      addEntropy(seed, info) {
        if (this.destroyed)
          throw new Error("cannot use destroyed DRBG");
        abytes(seed, this.state.length, "seed");
        const _seed = seed.slice();
        if (info) {
          abytes(info);
          if (info.length > _seed.length)
            throw new Error("info length is too big");
          for (let i = 0; i < info.length; i++)
            _seed[i] ^= info[i];
        }
        this.update(_seed);
        _seed.fill(0);
        this.reseedCnt = 1;
      }
      // Optional `info` is additional input for the pre/post-update steps; bytes
      // SP 800-90A Rev. 1 CTR_DRBG without a derivation function limits
      // additional_input to seedlen, which is exactly this internal state width.
      randomBytes(len, info) {
        if (this.destroyed)
          throw new Error("cannot use destroyed DRBG");
        anumber(len);
        if (len > 2 ** 16)
          throw new Error("requested output is too big");
        if (this.reseedCnt > 2 ** 48)
          throw new Error("entropy exhausted");
        if (info) {
          abytes(info);
          if (info.length > this.state.length)
            throw new Error("info length is too big");
          this.update(info);
        }
        const res = new Uint8Array(len);
        ctr(this.key, this.nonce).encrypt(res, res);
        incBytes(this.nonce, false, Math.ceil(len / this.blockLen));
        this.update(info);
        this.reseedCnt++;
        return res;
      }
      // Zeroes the current state and marks the instance destroyed. Fails closed:
      // any later randomBytes()/addEntropy() throws instead of continuing from the
      // zeroed state (which would make subsequent output the predictable zero-key stream).
      clean() {
        this.state.fill(0);
        this.reseedCnt = 0;
        this.destroyed = true;
      }
    };
    createAesDrbg = (keyLen) => {
      return (seed, personalization = void 0) => new _AesCtrDRBG(keyLen, seed, personalization);
    };
    rngAesCtrDrbg128 = /* @__PURE__ */ createAesDrbg(128);
    rngAesCtrDrbg256 = /* @__PURE__ */ createAesDrbg(256);
    _CMAC = class {
      constructor(key) {
        __publicField(this, "blockLen", BLOCK_SIZE2);
        __publicField(this, "outputLen", BLOCK_SIZE2);
        // CMAC can only decide between `K1` and `K2` once the true final block is known,
        // so updates process older blocks eagerly but keep one pending block buffered.
        __publicField(this, "buffer");
        __publicField(this, "pos");
        __publicField(this, "finished");
        __publicField(this, "destroyed");
        __publicField(this, "k1");
        __publicField(this, "k2");
        __publicField(this, "x");
        __publicField(this, "x32");
        __publicField(this, "xk");
        abytes(key);
        validateKeyLength(key);
        this.xk = expandKeyLE(key);
        this.buffer = new Uint8Array(BLOCK_SIZE2);
        this.pos = 0;
        this.finished = false;
        this.destroyed = false;
        this.x = new Uint8Array(BLOCK_SIZE2);
        this.x32 = u32(this.x);
        const L = new Uint8Array(BLOCK_SIZE2);
        encryptBlock(this.xk, L);
        this.k1 = dbl(L);
        this.k2 = dbl(new Uint8Array(this.k1));
      }
      // Consumes 16 bytes of `data` starting at `pos`; `pos` avoids a per-block
      // subarray view allocation in update().
      process(data, pos) {
        const { x, x32, xk } = this;
        for (let i = 0; i < BLOCK_SIZE2; i++)
          x[i] ^= data[pos + i];
        swap32IfBE(x32);
        const { s0, s1, s2, s3 } = encrypt(xk, x32[0], x32[1], x32[2], x32[3]);
        x32[0] = s0, x32[1] = s1, x32[2] = s2, x32[3] = s3;
        swap32IfBE(x32);
      }
      update(data) {
        aexists(this);
        abytes(data);
        let pos = 0;
        if (this.pos) {
          const take = Math.min(BLOCK_SIZE2 - this.pos, data.length);
          this.buffer.set(data.subarray(0, take), this.pos);
          this.pos += take;
          pos = take;
          if (this.pos === BLOCK_SIZE2 && pos < data.length) {
            this.process(this.buffer, 0);
            this.pos = 0;
          }
        }
        while (pos + BLOCK_SIZE2 < data.length) {
          this.process(data, pos);
          pos += BLOCK_SIZE2;
        }
        if (pos < data.length) {
          this.buffer.set(data.subarray(pos), 0);
          this.pos = data.length - pos;
        }
        return this;
      }
      // See {@link https://www.rfc-editor.org/rfc/rfc4493.html#section-2.4 | RFC 4493 Section 2.4}.
      digestInto(out) {
        aexists(this);
        aoutput32(out, this);
        this.finished = true;
        const view = out.subarray(0, this.outputLen);
        let last = new Uint8Array(BLOCK_SIZE2);
        if (this.pos === BLOCK_SIZE2) {
          last.set(this.buffer);
          xorBlock(last, this.k1);
        } else {
          last.set(this.buffer.subarray(0, this.pos));
          last[this.pos] = 128;
          xorBlock(last, this.k2);
        }
        view.set(this.x);
        xorBlock(view, last);
        encryptBlock(this.xk, view);
        clean(last);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      destroy() {
        const { buffer, destroyed, x, xk, k1, k2 } = this;
        if (destroyed)
          return;
        this.destroyed = true;
        clean(buffer, x, xk, k1, k2);
      }
    };
    cmac = /* @__PURE__ */ wrapMacConstructor(16, (key) => new _CMAC(key));
    siv = () => {
      throw new Error('"siv" from v1 is now "gcmsiv"');
    };
    aessiv2 = /* @__PURE__ */ wrapCipher({ blockSize: 16, tagLength: 16, withAAD: true }, function aessiv3(key, ...AAD) {
      const PLAIN_LIMIT = limit("plaintext", 0, 2 ** 132);
      const CIPHER_LIMIT = limit("ciphertext", 16, 2 ** 132 + 16);
      if (AAD.length > 126) {
        throw new Error('"AAD" expected <= 126 items');
      }
      AAD.forEach((aad) => abytes(aad));
      abytes(key);
      if (![32, 48, 64].includes(key.length))
        throw new Error('"aes key" expected Uint8Array of length 32/48/64, got length=' + key.length);
      const k1 = key.subarray(0, key.length / 2);
      const k2 = key.subarray(key.length / 2);
      return {
        // {@link https://datatracker.ietf.org/doc/html/rfc5297.html#section-2.6 | RFC 5297 Section 2.6}
        encrypt(plaintext) {
          PLAIN_LIMIT(plaintext.length);
          const v = s2v(k1, [...AAD, plaintext]);
          const q = Uint8Array.from(v);
          q[8] &= 127;
          q[12] &= 127;
          const c = ctr(k2, q).encrypt(plaintext);
          return concatBytes(v, c);
        },
        // {@link https://datatracker.ietf.org/doc/html/rfc5297.html#section-2.7 | RFC 5297 Section 2.7}
        decrypt(ciphertext) {
          CIPHER_LIMIT(ciphertext.length);
          const v = ciphertext.subarray(0, BLOCK_SIZE2);
          const c = ciphertext.subarray(BLOCK_SIZE2);
          const q = Uint8Array.from(v);
          q[8] &= 127;
          q[12] &= 127;
          const p = ctr(k2, q).decrypt(c);
          const t = s2v(k1, [...AAD, p]);
          if (equalBytes(t, v)) {
            return p;
          } else {
            clean(p);
            throw new Error("invalid siv tag");
          }
        }
      };
    });
    unsafe = /* @__PURE__ */ Object.freeze({
      expandKeyLE,
      expandKeyDecLE,
      encrypt,
      decrypt,
      encryptBlock,
      decryptBlock,
      ctrCounter,
      ctr32,
      dbl,
      xorBlock,
      xorend,
      s2v
    });
    __TESTS = /* @__PURE__ */ Object.freeze({
      incBytes
    });
  }
});

// node_modules/@noble/hashes/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function anumber2(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle2(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle2(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes2(value, length, title = "") {
  if (isBytes2(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber2(length, "length");
  const bytes = isBytes2(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle2(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("expected hash wrapped by utils.createHasher");
  anumber2(h.outputLen);
  anumber2(h.blockLen);
  if (h.outputLen < 1 || h.blockLen < 1)
    throw new Error("hash blockLen / outputLen must be >= 1");
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput2(out, instance) {
  abytes2(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function clean2(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var atitle2, aobject, aopts, oidNist;
var init_utils2 = __esm({
  "node_modules/@noble/hashes/utils.js"() {
    atitle2 = (title) => title ? `"${title}" ` : "";
    aobject = (value, label) => {
      if (value === null || typeof value !== "object" || Array.isArray(value))
        throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
    };
    aopts = (value, label) => {
      aobject(value, label);
      const proto = Object.getPrototypeOf(value);
      if (proto !== Object.prototype && proto !== null)
        throw new TypeError(`"${label}" expected plain object`);
      if (Object.hasOwn(value, "__proto__"))
        throw new TypeError(`"${label}.__proto__" is not allowed`);
    };
    oidNist = (suffix) => ({
      // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
      // Larger suffix values would need base-128 OID encoding and a different length byte.
      oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
    });
  }
});

// node_modules/@noble/hashes/hmac.js
var hmac_exports = {};
__export(hmac_exports, {
  _HMAC: () => _HMAC,
  hmac: () => hmac
});
var _HMAC, hmac;
var init_hmac = __esm({
  "node_modules/@noble/hashes/hmac.js"() {
    init_utils2();
    _HMAC = class {
      constructor(hash, key) {
        __publicField(this, "oHash");
        __publicField(this, "iHash");
        __publicField(this, "blockLen");
        __publicField(this, "outputLen");
        __publicField(this, "canXOF", false);
        __publicField(this, "finished", false);
        __publicField(this, "destroyed", false);
        ahash(hash);
        abytes2(key, void 0, "key");
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("expected Hash instance");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        clean2(pad);
      }
      update(buf) {
        aexists2(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const buf = out.subarray(0, this.outputLen);
        this.iHash.digestInto(buf);
        this.oHash.update(buf);
        this.oHash.digestInto(buf);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.canXOF = canXOF;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = /* @__PURE__ */ (() => {
      const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
      hmac_.create = (hash, key) => new _HMAC(hash, key);
      return hmac_;
    })();
  }
});

// node_modules/@noble/hashes/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function setU64FromNum(view, byteOffset, n, isLE2) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE2 ? l : h, isLE2);
  view.setUint32(byteOffset + 4, isLE2 ? h : l, isLE2);
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK64, _32n, fromNumH, fromNumL, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
var init_u64 = __esm({
  "node_modules/@noble/hashes/_u64.js"() {
    U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
    _32n = /* @__PURE__ */ BigInt(32);
    fromNumH = (n) => n / 2 ** 32 | 0;
    fromNumL = (n) => n >>> 0;
    shrSH = (h, _l, s) => h >>> s;
    shrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  }
});

// node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV, SHA224_IV, SHA384_IV, SHA512_IV;
var init_md = __esm({
  "node_modules/@noble/hashes/_md.js"() {
    init_u64();
    init_utils2();
    HashMD = class {
      constructor(blockLen, outputLen, padOffset, isLE2) {
        __publicField(this, "blockLen");
        __publicField(this, "outputLen");
        __publicField(this, "canXOF", false);
        __publicField(this, "padOffset");
        __publicField(this, "isLE");
        // For partial updates less than block size
        __publicField(this, "buffer");
        __publicField(this, "view");
        __publicField(this, "finished", false);
        __publicField(this, "length", 0);
        __publicField(this, "pos", 0);
        __publicField(this, "destroyed", false);
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView2(this.buffer);
      }
      update(data) {
        aexists2(this);
        abytes2(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        let processed = false;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView2(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            processed = true;
            continue;
          }
          buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
            processed = true;
          }
        }
        this.length += data.length;
        if (processed)
          this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        buffer.fill(0, pos);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          buffer.fill(0);
        }
        setU64FromNum(view, blockLen - 8, this.length * 8, isLE2);
        this.process(view, 0);
        this.roundClean();
        const oview = out === buffer ? view : createView2(out);
        const len = this.outputLen;
        const outLen = len / 4;
        const state = this.get();
        if (len % 4 || outLen > state.length)
          throw new Error("invalid outputLen");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE2);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneIntoMeta(to) {
        const { buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (pos)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    SHA224_IV = /* @__PURE__ */ Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]);
    SHA384_IV = /* @__PURE__ */ Uint32Array.from([
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ]);
    SHA512_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// node_modules/@noble/hashes/sha2.js
var sha2_exports = {};
__export(sha2_exports, {
  _SHA224: () => _SHA224,
  _SHA256: () => _SHA256,
  _SHA384: () => _SHA384,
  _SHA512: () => _SHA512,
  _SHA512_224: () => _SHA512_224,
  _SHA512_256: () => _SHA512_256,
  sha224: () => sha224,
  sha256: () => sha256,
  sha384: () => sha384,
  sha512: () => sha512,
  sha512_224: () => sha512_224,
  sha512_256: () => sha512_256
});
var SHA256_K, SHA256_W, SHA2_32B, _SHA256, _SHA224, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, _SHA384, T224_IV, T256_IV, _SHA512_224, _SHA512_256, sha256, sha224, sha512, sha384, sha512_256, sha512_224;
var init_sha2 = __esm({
  "node_modules/@noble/hashes/sha2.js"() {
    init_md();
    init_u64();
    init_utils2();
    SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    SHA2_32B = class extends HashMD {
      constructor(outputLen, IV) {
        super(64, outputLen, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        // Numeric initializers matter: starting the fields as `undefined` changes
        // V8's field representation and makes sha256 3x slower (measured).
        __publicField(this, "A", 0);
        __publicField(this, "B", 0);
        __publicField(this, "C", 0);
        __publicField(this, "D", 0);
        __publicField(this, "E", 0);
        __publicField(this, "F", 0);
        __publicField(this, "G", 0);
        __publicField(this, "H", 0);
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      _cloneInto(to) {
        (to || (to = new this.constructor())).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
          const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean2(SHA256_W);
      }
      destroy() {
        this.destroyed = true;
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean2(this.buffer);
      }
    };
    _SHA256 = class extends SHA2_32B {
      constructor() {
        super(32, SHA256_IV);
      }
    };
    _SHA224 = class extends SHA2_32B {
      constructor() {
        super(28, SHA224_IV);
      }
    };
    K512 = /* @__PURE__ */ (() => split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    SHA2_64B = class extends HashMD {
      constructor(outputLen, IV) {
        super(128, outputLen, 16, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        // h -- high 32 bits, l -- low 32 bits
        // Numeric initializers matter: starting the fields as `undefined` changes
        // V8's field representation and slows hashing down (measured on sha256).
        __publicField(this, "Ah", 0);
        __publicField(this, "Al", 0);
        __publicField(this, "Bh", 0);
        __publicField(this, "Bl", 0);
        __publicField(this, "Ch", 0);
        __publicField(this, "Cl", 0);
        __publicField(this, "Dh", 0);
        __publicField(this, "Dl", 0);
        __publicField(this, "Eh", 0);
        __publicField(this, "El", 0);
        __publicField(this, "Fh", 0);
        __publicField(this, "Fl", 0);
        __publicField(this, "Gh", 0);
        __publicField(this, "Gl", 0);
        __publicField(this, "Hh", 0);
        __publicField(this, "Hl", 0);
        this.Ah = IV[0] | 0;
        this.Al = IV[1] | 0;
        this.Bh = IV[2] | 0;
        this.Bl = IV[3] | 0;
        this.Ch = IV[4] | 0;
        this.Cl = IV[5] | 0;
        this.Dh = IV[6] | 0;
        this.Dl = IV[7] | 0;
        this.Eh = IV[8] | 0;
        this.El = IV[9] | 0;
        this.Fh = IV[10] | 0;
        this.Fl = IV[11] | 0;
        this.Gh = IV[12] | 0;
        this.Gl = IV[13] | 0;
        this.Hh = IV[14] | 0;
        this.Hl = IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      _cloneInto(to) {
        (to || (to = new this.constructor())).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
          const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
          const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
          const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
          const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
          const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = add3L(T1l, sigma0l, MAJl);
          Ah = add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        clean2(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        this.destroyed = true;
        clean2(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    _SHA512 = class extends SHA2_64B {
      constructor() {
        super(64, SHA512_IV);
      }
    };
    _SHA384 = class extends SHA2_64B {
      constructor() {
        super(48, SHA384_IV);
      }
    };
    T224_IV = /* @__PURE__ */ Uint32Array.from([
      2352822216,
      424955298,
      1944164710,
      2312950998,
      502970286,
      855612546,
      1738396948,
      1479516111,
      258812777,
      2077511080,
      2011393907,
      79989058,
      1067287976,
      1780299464,
      286451373,
      2446758561
    ]);
    T256_IV = /* @__PURE__ */ Uint32Array.from([
      573645204,
      4230739756,
      2673172387,
      3360449730,
      596883563,
      1867755857,
      2520282905,
      1497426621,
      2519219938,
      2827943907,
      3193839141,
      1401305490,
      721525244,
      746961066,
      246885852,
      2177182882
    ]);
    _SHA512_224 = class extends SHA2_64B {
      constructor() {
        super(28, T224_IV);
      }
    };
    _SHA512_256 = class extends SHA2_64B {
      constructor() {
        super(32, T256_IV);
      }
    };
    sha256 = /* @__PURE__ */ createHasher(
      () => new _SHA256(),
      /* @__PURE__ */ oidNist(1)
    );
    sha224 = /* @__PURE__ */ createHasher(
      () => new _SHA224(),
      /* @__PURE__ */ oidNist(4)
    );
    sha512 = /* @__PURE__ */ createHasher(
      () => new _SHA512(),
      /* @__PURE__ */ oidNist(3)
    );
    sha384 = /* @__PURE__ */ createHasher(
      () => new _SHA384(),
      /* @__PURE__ */ oidNist(2)
    );
    sha512_256 = /* @__PURE__ */ createHasher(
      () => new _SHA512_256(),
      /* @__PURE__ */ oidNist(6)
    );
    sha512_224 = /* @__PURE__ */ createHasher(
      () => new _SHA512_224(),
      /* @__PURE__ */ oidNist(5)
    );
  }
});

// src/sinewix/index.js
var { sortStreamsByQuality } = require_quality();
var { loadConfig, val, wrapAll } = require_config();
var { gcm: gcm2 } = (init_aes(), __toCommonJS(aes_exports));
var { hmac: hmac2 } = (init_hmac(), __toCommonJS(hmac_exports));
var { sha256: sha2562 } = (init_sha2(), __toCommonJS(sha2_exports));
var _cfgReady = null;
function cfgReady() {
  if (!_cfgReady) {
    _cfgReady = loadConfig().then(function() {
      var v;
      v = val("urls.movies.sinewix.api_base");
      if (v) API_BASE = String(v).replace(/\/+$/, "");
      v = val("urls.movies.sinewix.panel_base");
      if (v) PANEL_BASE = String(v).replace(/\/+$/, "");
      if (STREAM_HEADERS) {
        STREAM_HEADERS.Referer = PANEL_BASE + "/";
        STREAM_HEADERS.Origin = PANEL_BASE;
      }
    });
  }
  return _cfgReady;
}
var API_BASE = "https://ydfvfdizipanel.ru/public/api";
var PANEL_BASE = "https://ydfvfdizipanel.ru";
var API_KEY = "9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA";
var SECRET_HMAC = "4962QZiZZqWbQlC0k0pdIvojy-STtR8NTq7oQCxMGBF2kwsVX2DBxgK72BovMy4U";
var SECRET_RESP = "H1KKG-JCt1RqHQawNxw7xujy2-vevYuyBqX3Aei1EAdi9VwDnmRL-3Oz2xxvy1VU";
var HASH256 = "f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0";
var STREAM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Referer": PANEL_BASE + "/",
  "Origin": PANEL_BASE
};
var cachedToken = null;
function randomNonce() {
  var bytes = new Uint8Array(24);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (var i = 0; i < 24; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  var binary = "";
  for (var j = 0; j < bytes.length; j++) binary += String.fromCharCode(bytes[j]);
  if (typeof btoa !== "undefined") {
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(bytes).toString("base64url");
}
function hexFromBytes(bytes) {
  var hex = "";
  for (var i = 0; i < bytes.length; i++) {
    var h = bytes[i].toString(16);
    hex += h.length === 1 ? "0" + h : h;
  }
  return hex;
}
function base64ToBytes(b64) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  var bin = atob(b64);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function bytesToUtf8(bytes) {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder().decode(bytes);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("utf8");
  }
  var str = "";
  for (var i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return decodeURIComponent(escape(str));
}
function utf8ToBytes(str) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(str, "utf8"));
  }
  var unesc = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(unesc.length);
  for (var i = 0; i < unesc.length; i++) bytes[i] = unesc.charCodeAt(i);
  return bytes;
}
function decryptResponse(data, sessionId) {
  if (!data || !data.encrypted) return data;
  var aadBytes = base64ToBytes(data.aad);
  var aadStr = bytesToUtf8(aadBytes);
  var lines = aadStr.split("\n");
  var ts = lines[2];
  var nce = lines[3];
  var hmacInput = "easyplex-response-v1|" + (sessionId || "") + "|" + nce + "|" + ts;
  var key = hmac2(sha2562, utf8ToBytes(SECRET_RESP), utf8ToBytes(hmacInput));
  var iv = base64ToBytes(data.iv);
  var tag = base64ToBytes(data.tag);
  var aad = aadBytes;
  var ct = base64ToBytes(data.ciphertext);
  var ciphertextWithTag = new Uint8Array(ct.length + tag.length);
  ciphertextWithTag.set(ct, 0);
  ciphertextWithTag.set(tag, ct.length);
  var cipher = gcm2(key, iv, aad);
  var dec = cipher.decrypt(ciphertextWithTag);
  return JSON.parse(bytesToUtf8(dec));
}
function getAccessToken() {
  return __async(this, null, function* () {
    if (cachedToken && cachedToken.expires_at > Date.now() + 6e4) {
      return cachedToken;
    }
    var timestamp = Math.floor(Date.now() / 1e3);
    var nonce = randomNonce();
    var params = [
      "signature=" + encodeURIComponent(HASH256),
      "package_name=" + encodeURIComponent("com.wxsmash.game"),
      "device_id=" + encodeURIComponent("8a9b2c3d4e5f6a7b"),
      "nonce=" + encodeURIComponent(nonce),
      "timestamp=" + encodeURIComponent(String(timestamp)),
      "app_version=" + encodeURIComponent("2.5.3"),
      "app_id=" + encodeURIComponent("sinewix-mobile"),
      "platform=" + encodeURIComponent("android")
    ].join("&");
    var bodyHash = hexFromBytes(sha2562(utf8ToBytes(params)));
    var payload = "POST\n/api/tokens/mobile/generate\n" + timestamp + "\n" + nonce + "\n" + bodyHash;
    var sig = "sha256=" + hexFromBytes(hmac2(sha2562, utf8ToBytes(SECRET_HMAC), utf8ToBytes(payload)));
    var res = yield fetch(API_BASE + "/tokens/mobile/generate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "packagename": "com.wxsmash.game",
        "User-Agent": "EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)",
        "X-App-Id": "sinewix-mobile",
        "X-Platform": "android",
        "X-Device-Id": "8a9b2c3d4e5f6a7b",
        "X-Timestamp": String(timestamp),
        "X-Nonce": nonce,
        "X-Signature": sig,
        "hash256": HASH256
      },
      body: params
    });
    var raw = yield res.json();
    var data = decryptResponse(raw, "");
    if (!data.access_token) {
      throw new Error("Failed to obtain SineWix token: " + JSON.stringify(data));
    }
    cachedToken = {
      token: data.access_token,
      sessionId: data.session_id,
      expires_at: Date.now() + (data.expires_in || 86400) * 1e3
    };
    return cachedToken;
  });
}
function apiRequest(path) {
  return __async(this, null, function* () {
    var tok = yield getAccessToken();
    var timestamp = Math.floor(Date.now() / 1e3);
    var nonce = randomNonce();
    var bodyHash = hexFromBytes(sha2562(utf8ToBytes("")));
    var payload = "GET\n" + path + "\n" + timestamp + "\n" + nonce + "\n" + bodyHash;
    var sig = "sha256=" + hexFromBytes(hmac2(sha2562, utf8ToBytes(SECRET_HMAC), utf8ToBytes(payload)));
    var subPath = path.replace(/^\/api/, "");
    var res = yield fetch(API_BASE + subPath, {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + tok.token,
        "X-Session-Id": tok.sessionId,
        "packagename": "com.wxsmash.game",
        "User-Agent": "EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)",
        "X-App-Id": "sinewix-mobile",
        "X-Platform": "android",
        "X-Device-Id": "8a9b2c3d4e5f6a7b",
        "X-Timestamp": String(timestamp),
        "X-Nonce": nonce,
        "X-Signature": sig,
        "hash256": HASH256
      }
    });
    if (res.status === 401) {
      cachedToken = null;
      return apiRequest(path);
    }
    var raw = yield res.json();
    return decryptResponse(raw, tok.sessionId);
  });
}
function resolveMediaFireLink(link) {
  return fetch(link).then(function(res) {
    return res.text();
  }).then(function(html) {
    var match = html.match(/href="(https:\/\/download\d+\.mediafire\.com[^"]+)"/);
    return match ? match[1] : link;
  }).catch(function() {
    return link;
  });
}
function buildStreams(videos, sinewixName) {
  if (!Array.isArray(videos)) return Promise.resolve([]);
  return Promise.all(
    videos.map(function(v) {
      var link = v.link;
      var serverName = v.server || "Sunucu";
      var isMF = link && link.includes("mediafire.com");
      var isDual = v.lang && /dual/i.test(v.lang) || link && /dual/i.test(link);
      var isDub = v.lang && /turkish|tr|turk/i.test(v.lang) && !isDual;
      var langLabel = isDual ? "\u{1F1F9}\u{1F1F7} DUAL (TR/EN)" : isDub ? "\u{1F1F9}\u{1F1F7} TR Dublaj" : "\u{1F310} TR Altyaz\u0131 / " + (v.lang || "T\xFCrk\xE7e");
      var displayTitle = "\u231C SineWix \u231F | " + (isMF ? "MediaFire" : serverName) + " | " + langLabel + " (1080p)";
      if (isMF) {
        return resolveMediaFireLink(link).then(function(finalUrl) {
          return {
            name: "SineWix",
            title: displayTitle,
            url: finalUrl,
            quality: "1080p",
            format: "mkv",
            isHls: false,
            headers: STREAM_HEADERS,
            behaviorHints: {
              notWebReady: true,
              proxyHeaders: { request: STREAM_HEADERS }
            },
            provider: "sinewix"
          };
        });
      }
      return Promise.resolve({
        name: "SineWix",
        title: displayTitle,
        url: link,
        quality: "1080p",
        format: link.includes(".m3u8") ? "hls" : link.includes(".mp4") ? "mp4" : "mkv",
        isHls: link.includes(".m3u8"),
        headers: STREAM_HEADERS,
        behaviorHints: {
          notWebReady: true,
          proxyHeaders: { request: STREAM_HEADERS }
        },
        provider: "sinewix"
      });
    })
  );
}
function searchAndFetch(title, originalTitle, targetImdb, mediaType, seasonNum, episodeNum, targetYear, targetTmdbId) {
  return __async(this, null, function* () {
    try {
      var query = originalTitle || title || "";
      if (!query) return [];
      var searchPath = "/api/search/" + encodeURIComponent(query) + "/" + API_KEY;
      var data = yield apiRequest(searchPath).catch(function() {
        return {};
      });
      var results = data && data.search || [];
      if (results.length === 0 && title && title.toLowerCase() !== query.toLowerCase()) {
        var fPath = "/api/search/" + encodeURIComponent(title) + "/" + API_KEY;
        var fData = yield apiRequest(fPath).catch(function() {
          return {};
        });
        results = fData && fData.search || [];
      }
      if (!results || results.length === 0) return [];
      var path = mediaType === "movie" ? "/api/media/detail" : "/api/series/show";
      var detailedItems = yield Promise.all(
        results.slice(0, 5).map(function(item) {
          return apiRequest(path + "/" + item.id + "/" + API_KEY).catch(function() {
            return null;
          });
        })
      );
      var cleanTmdb = targetTmdbId ? String(targetTmdbId) : null;
      var bestMatch = detailedItems.find(function(item) {
        if (!item) return false;
        if (cleanTmdb && item.tmdb_id && String(item.tmdb_id) === cleanTmdb) return true;
        if (targetImdb && item.imdb_external_id && item.imdb_external_id === targetImdb) return true;
        var itemYear = (item.release_date || item.first_air_date || "").split("-")[0];
        var itemTitle = (item.title || item.name || "").toLowerCase().trim();
        var origMatch = originalTitle && itemTitle === originalTitle.toLowerCase().trim();
        var titleMatch = title && itemTitle === title.toLowerCase().trim();
        return (origMatch || titleMatch) && (!targetYear || !itemYear || itemYear === targetYear);
      });
      if (!bestMatch && detailedItems.length > 0) {
        bestMatch = detailedItems.find(function(item) {
          if (!item) return false;
          var itemTitle = (item.title || item.name || "").toLowerCase().trim();
          return originalTitle && itemTitle.includes(originalTitle.toLowerCase().trim()) || title && itemTitle.includes(title.toLowerCase().trim());
        });
      }
      if (!bestMatch) return [];
      var vList = [];
      if (mediaType === "movie") {
        vList = bestMatch.videos || [];
      } else {
        var s = (bestMatch.seasons || []).find(function(sea) {
          return parseInt(sea.season_number) === parseInt(seasonNum);
        });
        if (s && s.episodes) {
          var e = s.episodes.find(function(ep) {
            return parseInt(ep.episode_number) === parseInt(episodeNum);
          });
          if (e) vList = e.videos || [];
        }
      }
      return yield buildStreams(vList, bestMatch.title || bestMatch.name || title);
    } catch (e2) {
      return [];
    }
  });
}
function resolveTmdbInfo(rawId, mediaType) {
  return __async(this, null, function* () {
    var TMDB_KEY = "500330721680edb6d5f7f12ba7cd9023";
    var cleanId = String(rawId).replace(/^tmdb:/, "").split(":")[0].trim();
    var isImdb = cleanId.startsWith("tt");
    var isTV = mediaType === "tv" || mediaType === "series";
    try {
      if (isImdb) {
        var findUrl = "https://api.themoviedb.org/3/find/" + cleanId + "?api_key=" + TMDB_KEY + "&external_source=imdb_id";
        var r = yield fetch(findUrl);
        var d = yield r.json();
        var item = isTV ? d.tv_results && d.tv_results[0] : d.movie_results && d.movie_results[0];
        if (!item) return null;
        return {
          id: item.id,
          tmdb_id: item.id,
          title: item.title || item.name,
          original_title: item.original_title || item.original_name,
          release_date: item.release_date || item.first_air_date || "",
          imdb_id: cleanId
        };
      } else {
        var tmdbType = isTV ? "tv" : "movie";
        var tmdbUrl = "https://api.themoviedb.org/3/" + tmdbType + "/" + cleanId + "?api_key=" + TMDB_KEY + "&language=tr-TR&append_to_response=external_ids";
        var res = yield fetch(tmdbUrl);
        var data = yield res.json();
        if (!data || !data.title && !data.name) return null;
        data.tmdb_id = data.id;
        return data;
      }
    } catch (e) {
      return null;
    }
  });
}
function getCatalog(args) {
  return __async(this, null, function* () {
    try {
      var query = args && args.search || args && args.extra && args.extra.search || args && args.query || "";
      var isMovie = args && (args.type === "movie" || args.id === "anthology_sinewix_movies");
      if (query) {
        var sData = yield apiRequest("/api/search/" + encodeURIComponent(query) + "/" + API_KEY);
        var items = (sData && sData.search || []).map(function(it) {
          var mType = it.type === "movie" || it.title ? "movie" : "series";
          var mId = mType === "movie" ? "sinewix:movie:" + it.id : "sinewix:series:" + it.id;
          var poster = (it.poster_path || "").replace("http://", "https://");
          var bg = (it.backdrop_path || "").replace("http://", "https://");
          return {
            id: mId,
            type: mType === "movie" ? "movie" : "tv",
            name: it.title || it.name,
            poster,
            background: bg,
            description: it.overview || "",
            genres: ["SineWix"]
          };
        });
        return { metas: items };
      }
      if (isMovie) {
        var mData = yield apiRequest("/api/search/film/" + API_KEY);
        var mItems = (mData && mData.search || []).map(function(it) {
          var poster = (it.poster_path || "").replace("http://", "https://");
          var bg = (it.backdrop_path || "").replace("http://", "https://");
          return {
            id: "sinewix:movie:" + it.id,
            type: "movie",
            name: it.title || it.name,
            poster,
            background: bg,
            description: it.overview || "",
            genres: ["SineWix", "Film"]
          };
        });
        return { metas: mItems };
      }
      var serData = yield apiRequest("/api/series/popular/" + API_KEY);
      var sItems = (serData && serData.popularSeries || []).map(function(it) {
        var poster = (it.poster_path || "").replace("http://", "https://");
        var bg = (it.backdrop_path || "").replace("http://", "https://");
        return {
          id: "sinewix:series:" + it.id,
          type: "tv",
          name: it.name,
          poster,
          background: bg,
          description: it.overview || "",
          genres: ["SineWix", "Pop\xFCler Dizi"]
        };
      });
      return { metas: sItems };
    } catch (e) {
      return { metas: [] };
    }
  });
}
function getMeta(args) {
  return __async(this, null, function* () {
    try {
      var rawId = typeof args === "string" ? args : args && args.id ? args.id : "";
      if (!rawId) return { meta: null };
      if (rawId.startsWith("sinewix:movie:")) {
        var mId = rawId.replace("sinewix:movie:", "");
        var it = yield apiRequest("/api/media/detail/" + mId + "/" + API_KEY);
        var poster = (it.poster_path || "").replace("http://", "https://");
        var bg = (it.backdrop_path || "").replace("http://", "https://");
        return {
          meta: {
            id: rawId,
            type: "movie",
            name: it.title || it.name,
            poster,
            background: bg,
            description: it.overview || "",
            genres: ["SineWix", "Film"],
            videos: [{ id: rawId, title: it.title || it.name }]
          }
        };
      }
      if (rawId.startsWith("sinewix:series:")) {
        var sId = rawId.replace("sinewix:series:", "");
        var sIt = yield apiRequest("/api/series/show/" + sId + "/" + API_KEY);
        var sPoster = (sIt.poster_path || "").replace("http://", "https://");
        var sBg = (sIt.backdrop_path || "").replace("http://", "https://");
        var videos = [];
        (sIt.seasons || []).forEach(function(sea) {
          var sNum = sea.season_number !== void 0 && sea.season_number !== null && !isNaN(parseInt(sea.season_number)) ? parseInt(sea.season_number) : 1;
          (sea.episodes || []).forEach(function(ep) {
            var eNum = ep.episode_number !== void 0 && ep.episode_number !== null && !isNaN(parseInt(ep.episode_number)) ? parseInt(ep.episode_number) : 1;
            videos.push({
              id: "sinewix:ep:" + sId + ":" + sNum + ":" + eNum,
              title: ep.name || sNum + ". Sezon " + eNum + ". B\xF6l\xFCm",
              season: sNum,
              episode: eNum
            });
          });
        });
        return {
          meta: {
            id: rawId,
            type: "tv",
            name: sIt.name,
            poster: sPoster,
            background: sBg,
            description: sIt.overview || "",
            genres: ["SineWix", "Pop\xFCler Dizi"],
            videos
          }
        };
      }
      return { meta: null };
    } catch (e) {
      return { meta: null };
    }
  });
}
function getStreams(id, mediaType, seasonNum, episodeNum) {
  return __async(this, null, function* () {
    try {
      if (typeof id === "object" && id) {
        seasonNum = id.season || seasonNum;
        episodeNum = id.episode || episodeNum;
        mediaType = id.type || mediaType;
        id = id.id || id.tmdb_id;
      }
      if (typeof id === "string" && !id.startsWith("sinewix:")) {
        var cleanId = id.trim();
        if (cleanId.includes(":")) {
          var p = cleanId.split(":");
          id = p[0];
          if (p[1]) seasonNum = p[1];
          if (p[2]) episodeNum = p[2];
          if (seasonNum) mediaType = "tv";
        }
      }
      if (!mediaType) {
        mediaType = seasonNum || episodeNum ? "tv" : "movie";
      }
      if (typeof id === "string" && id.startsWith("sinewix:movie:")) {
        var mId = id.replace("sinewix:movie:", "");
        var mData = yield apiRequest("/api/media/detail/" + mId + "/" + API_KEY);
        return yield buildStreams(mData.videos || [], mData.title || mData.name);
      }
      if (typeof id === "string" && id.startsWith("sinewix:series:")) {
        var showMeta = yield getMeta(id);
        if (showMeta && showMeta.meta && Array.isArray(showMeta.meta.videos) && showMeta.meta.videos.length > 0) {
          return yield getStreams(showMeta.meta.videos[0].id);
        }
      }
      if (typeof id === "string" && id.startsWith("sinewix:ep:")) {
        var parts = id.replace("sinewix:ep:", "").split(":");
        var showId = parts[0];
        var targetSeason = parseInt(parts[1]) || 1;
        var targetEpisode = parseInt(parts[2]) || 1;
        var sData = yield apiRequest("/api/series/show/" + showId + "/" + API_KEY);
        var targetSeasonObj = (sData.seasons || []).find(function(s) {
          return parseInt(s.season_number) === targetSeason;
        });
        if (targetSeasonObj && targetSeasonObj.episodes) {
          var targetEpObj = targetSeasonObj.episodes.find(function(e) {
            return parseInt(e.episode_number) === targetEpisode;
          });
          if (targetEpObj && targetEpObj.videos) {
            return yield buildStreams(targetEpObj.videos, sData.name);
          }
        }
        return [];
      }
      var data = yield resolveTmdbInfo(id, mediaType);
      if (!data) return [];
      var ot = data.original_title || data.original_name || data.title || data.name;
      var releaseDate = data.release_date || data.first_air_date || "";
      var year = releaseDate ? releaseDate.split("-")[0] : "";
      var targetImdb = data.imdb_id || data.external_ids && data.external_ids.imdb_id;
      var targetTmdbId = data.tmdb_id || data.id;
      var streams = yield searchAndFetch(
        data.title || data.name,
        ot,
        targetImdb,
        mediaType,
        seasonNum || 1,
        episodeNum || 1,
        year,
        targetTmdbId
      );
      return streams || [];
    } catch (e) {
      return [];
    }
  });
}
if (typeof getStreams === "function") {
  _origGetStreams = getStreams;
  getStreams = function() {
    return __async(this, arguments, function* () {
      var res = yield _origGetStreams.apply(this, arguments);
      return sortStreamsByQuality(res);
    });
  };
}
var _origGetStreams;
if (typeof module !== "undefined") module.exports = wrapAll({ getStreams, getMeta, getCatalog }, cfgReady);
if (typeof globalThis !== "undefined") {
  globalThis.getStreams = getStreams;
  globalThis.getMeta = getMeta;
  globalThis.getCatalog = getCatalog;
}
if (typeof globalThis !== "undefined" && typeof module !== "undefined" && module.exports) {
  if (module.exports.getStreams) globalThis.getStreams = module.exports.getStreams;
  if (module.exports.getCatalog) globalThis.getCatalog = module.exports.getCatalog;
  if (module.exports.getMeta) globalThis.getMeta = module.exports.getMeta;
}
/*! Bundled license information:

@noble/ciphers/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)
*/

if (typeof globalThis !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    if (module.exports.getStreams) globalThis.getStreams = module.exports.getStreams;
    if (module.exports.getCatalog) globalThis.getCatalog = module.exports.getCatalog;
    if (module.exports.getMeta) globalThis.getMeta = module.exports.getMeta;
    if (module.exports.getSubtitles) globalThis.getSubtitles = module.exports.getSubtitles;
}

