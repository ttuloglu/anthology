const { sortStreamsByQuality } = require("../shared/quality.js");
const { loadConfig, val, wrapAll } = require("../shared/config.js");
const { gcm } = require("@noble/ciphers/aes.js");
const { hmac } = require("@noble/hashes/hmac.js");
const { sha256 } = require("@noble/hashes/sha2.js");

var _cfgReady = null;
function cfgReady() {
  if (!_cfgReady) {
    _cfgReady = loadConfig().then(function () {
      var v;
      v = val('urls.movies.sinewix.api_base'); if (v) API_BASE = String(v).replace(/\/+$/, '');
      v = val('urls.movies.sinewix.panel_base'); if (v) PANEL_BASE = String(v).replace(/\/+$/, '');
      if (STREAM_HEADERS) { STREAM_HEADERS.Referer = PANEL_BASE + "/"; STREAM_HEADERS.Origin = PANEL_BASE; }
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
  var key = hmac(sha256, utf8ToBytes(SECRET_RESP), utf8ToBytes(hmacInput));
  var iv = base64ToBytes(data.iv);
  var tag = base64ToBytes(data.tag);
  var aad = aadBytes;
  var ct = base64ToBytes(data.ciphertext);

  var ciphertextWithTag = new Uint8Array(ct.length + tag.length);
  ciphertextWithTag.set(ct, 0);
  ciphertextWithTag.set(tag, ct.length);

  var cipher = gcm(key, iv, aad);
  var dec = cipher.decrypt(ciphertextWithTag);
  return JSON.parse(bytesToUtf8(dec));
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
    return cachedToken;
  }
  var timestamp = Math.floor(Date.now() / 1000);
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

  var bodyHash = hexFromBytes(sha256(utf8ToBytes(params)));
  var payload = "POST\n/api/tokens/mobile/generate\n" + timestamp + "\n" + nonce + "\n" + bodyHash;
  var sig = "sha256=" + hexFromBytes(hmac(sha256, utf8ToBytes(SECRET_HMAC), utf8ToBytes(payload)));

  var res = await fetch(API_BASE + "/tokens/mobile/generate", {
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
  var raw = await res.json();
  var data = decryptResponse(raw, "");
  if (!data.access_token) {
    throw new Error("Failed to obtain SineWix token: " + JSON.stringify(data));
  }
  cachedToken = {
    token: data.access_token,
    sessionId: data.session_id,
    expires_at: Date.now() + (data.expires_in || 86400) * 1000
  };
  return cachedToken;
}

async function apiRequest(path) {
  var tok = await getAccessToken();
  var timestamp = Math.floor(Date.now() / 1000);
  var nonce = randomNonce();
  var bodyHash = hexFromBytes(sha256(utf8ToBytes("")));
  var payload = "GET\n" + path + "\n" + timestamp + "\n" + nonce + "\n" + bodyHash;
  var sig = "sha256=" + hexFromBytes(hmac(sha256, utf8ToBytes(SECRET_HMAC), utf8ToBytes(payload)));

  var subPath = path.replace(/^\/api/, "");
  var res = await fetch(API_BASE + subPath, {
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

  var raw = await res.json();
  return decryptResponse(raw, tok.sessionId);
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
      var isDual = (v.lang && /dual/i.test(v.lang)) || (link && /dual/i.test(link));
      var isDub = (v.lang && /turkish|tr|turk/i.test(v.lang)) && !isDual;
      var langLabel = isDual ? "🇹🇷 DUAL (TR/EN)" : (isDub ? "🇹🇷 TR Dublaj" : "🌐 TR Altyazı / " + (v.lang || "Türkçe"));
      var displayTitle = "⌜ SineWix ⌟ | " + (isMF ? "MediaFire" : serverName) + " | " + langLabel + " (1080p)";

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
        format: link.includes(".m3u8") ? "hls" : (link.includes(".mp4") ? "mp4" : "mkv"),
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

async function searchAndFetch(title, originalTitle, targetImdb, mediaType, seasonNum, episodeNum, targetYear, targetTmdbId) {
  try {
    var query = originalTitle || title || "";
    if (!query) return [];

    var searchPath = "/api/search/" + encodeURIComponent(query) + "/" + API_KEY;
    var data = await apiRequest(searchPath).catch(function() { return {}; });
    var results = (data && data.search) || [];

    if (results.length === 0 && title && title.toLowerCase() !== query.toLowerCase()) {
      var fPath = "/api/search/" + encodeURIComponent(title) + "/" + API_KEY;
      var fData = await apiRequest(fPath).catch(function() { return {}; });
      results = (fData && fData.search) || [];
    }

    if (!results || results.length === 0) return [];

    var path = mediaType === "movie" ? "/api/media/detail" : "/api/series/show";
    var detailedItems = await Promise.all(
      results.slice(0, 5).map(function(item) {
        return apiRequest(path + "/" + item.id + "/" + API_KEY).catch(function() { return null; });
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
        return (originalTitle && itemTitle.includes(originalTitle.toLowerCase().trim())) ||
               (title && itemTitle.includes(title.toLowerCase().trim()));
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

    return await buildStreams(vList, bestMatch.title || bestMatch.name || title);
  } catch (e2) {
    return [];
  }
}

async function resolveTmdbInfo(rawId, mediaType) {
  var TMDB_KEY = "500330721680edb6d5f7f12ba7cd9023";
  var cleanId = String(rawId).replace(/^tmdb:/, "").split(":")[0].trim();
  var isImdb = cleanId.startsWith("tt");
  var isTV = mediaType === "tv" || mediaType === "series";

  try {
    if (isImdb) {
      var findUrl = "https://api.themoviedb.org/3/find/" + cleanId + "?api_key=" + TMDB_KEY + "&external_source=imdb_id";
      var r = await fetch(findUrl);
      var d = await r.json();
      var item = isTV ? (d.tv_results && d.tv_results[0]) : (d.movie_results && d.movie_results[0]);
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
      var res = await fetch(tmdbUrl);
      var data = await res.json();
      if (!data || (!data.title && !data.name)) return null;
      data.tmdb_id = data.id;
      return data;
    }
  } catch (e) {
    return null;
  }
}

async function getCatalog(args) {
  try {
    var query = (args && args.search) || (args && args.extra && args.extra.search) || (args && args.query) || "";
    var isMovie = args && (args.type === "movie" || args.id === "anthology_sinewix_movies");

    if (query) {
      var sData = await apiRequest("/api/search/" + encodeURIComponent(query) + "/" + API_KEY);
      var items = ((sData && sData.search) || []).map(function(it) {
        var mType = it.type === "movie" || it.title ? "movie" : "series";
        var mId = mType === "movie" ? "sinewix:movie:" + it.id : "sinewix:series:" + it.id;
        var poster = (it.poster_path || "").replace("http://", "https://");
        var bg = (it.backdrop_path || "").replace("http://", "https://");
        return {
          id: mId,
          type: mType === "movie" ? "movie" : "tv",
          name: it.title || it.name,
          poster: poster,
          background: bg,
          description: it.overview || "",
          genres: ["SineWix"]
        };
      });
      return { metas: items };
    }

    if (isMovie) {
      var mData = await apiRequest("/api/search/film/" + API_KEY);
      var mItems = ((mData && mData.search) || []).map(function(it) {
        var poster = (it.poster_path || "").replace("http://", "https://");
        var bg = (it.backdrop_path || "").replace("http://", "https://");
        return {
          id: "sinewix:movie:" + it.id,
          type: "movie",
          name: it.title || it.name,
          poster: poster,
          background: bg,
          description: it.overview || "",
          genres: ["SineWix", "Film"]
        };
      });
      return { metas: mItems };
    }

    var serData = await apiRequest("/api/series/popular/" + API_KEY);
    var sItems = ((serData && serData.popularSeries) || []).map(function(it) {
      var poster = (it.poster_path || "").replace("http://", "https://");
      var bg = (it.backdrop_path || "").replace("http://", "https://");
      return {
        id: "sinewix:series:" + it.id,
        type: "tv",
        name: it.name,
        poster: poster,
        background: bg,
        description: it.overview || "",
        genres: ["SineWix", "Popüler Dizi"]
      };
    });
    return { metas: sItems };
  } catch (e) {
    return { metas: [] };
  }
}

async function getMeta(args) {
  try {
    var rawId = typeof args === "string" ? args : (args && args.id ? args.id : "");
    if (!rawId) return { meta: null };

    if (rawId.startsWith("sinewix:movie:")) {
      var mId = rawId.replace("sinewix:movie:", "");
      var it = await apiRequest("/api/media/detail/" + mId + "/" + API_KEY);
      var poster = (it.poster_path || "").replace("http://", "https://");
      var bg = (it.backdrop_path || "").replace("http://", "https://");
      return {
        meta: {
          id: rawId,
          type: "movie",
          name: it.title || it.name,
          poster: poster,
          background: bg,
          description: it.overview || "",
          genres: ["SineWix", "Film"],
          videos: [{ id: rawId, title: it.title || it.name }]
        }
      };
    }

    if (rawId.startsWith("sinewix:series:")) {
      var sId = rawId.replace("sinewix:series:", "");
      var sIt = await apiRequest("/api/series/show/" + sId + "/" + API_KEY);
      var sPoster = (sIt.poster_path || "").replace("http://", "https://");
      var sBg = (sIt.backdrop_path || "").replace("http://", "https://");
      var videos = [];

      (sIt.seasons || []).forEach(function(sea) {
        var sNum = sea.season_number !== undefined && sea.season_number !== null && !isNaN(parseInt(sea.season_number)) ? parseInt(sea.season_number) : 1;
        (sea.episodes || []).forEach(function(ep) {
          var eNum = ep.episode_number !== undefined && ep.episode_number !== null && !isNaN(parseInt(ep.episode_number)) ? parseInt(ep.episode_number) : 1;
          videos.push({
            id: "sinewix:ep:" + sId + ":" + sNum + ":" + eNum,
            title: ep.name || (sNum + ". Sezon " + eNum + ". Bölüm"),
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
          genres: ["SineWix", "Popüler Dizi"],
          videos: videos
        }
      };
    }

    return { meta: null };
  } catch (e) {
    return { meta: null };
  }
}

async function getStreams(id, mediaType, seasonNum, episodeNum) {
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
      mediaType = (seasonNum || episodeNum) ? "tv" : "movie";
    }

    if (typeof id === "string" && id.startsWith("sinewix:movie:")) {
      var mId = id.replace("sinewix:movie:", "");
      var mData = await apiRequest("/api/media/detail/" + mId + "/" + API_KEY);
      return await buildStreams(mData.videos || [], mData.title || mData.name);
    }

    if (typeof id === "string" && id.startsWith("sinewix:series:")) {
      var showMeta = await getMeta(id);
      if (showMeta && showMeta.meta && Array.isArray(showMeta.meta.videos) && showMeta.meta.videos.length > 0) {
        return await getStreams(showMeta.meta.videos[0].id);
      }
    }

    if (typeof id === "string" && id.startsWith("sinewix:ep:")) {
      var parts = id.replace("sinewix:ep:", "").split(":");
      var showId = parts[0];
      var targetSeason = parseInt(parts[1]) || 1;
      var targetEpisode = parseInt(parts[2]) || 1;
      var sData = await apiRequest("/api/series/show/" + showId + "/" + API_KEY);
      var targetSeasonObj = (sData.seasons || []).find(function(s) {
        return parseInt(s.season_number) === targetSeason;
      });
      if (targetSeasonObj && targetSeasonObj.episodes) {
        var targetEpObj = targetSeasonObj.episodes.find(function(e) {
          return parseInt(e.episode_number) === targetEpisode;
        });
        if (targetEpObj && targetEpObj.videos) {
          return await buildStreams(targetEpObj.videos, sData.name);
        }
      }
      return [];
    }

    var data = await resolveTmdbInfo(id, mediaType);
    if (!data) return [];

    var ot = data.original_title || data.original_name || data.title || data.name;
    var releaseDate = data.release_date || data.first_air_date || "";
    var year = releaseDate ? releaseDate.split("-")[0] : "";
    var targetImdb = data.imdb_id || (data.external_ids && data.external_ids.imdb_id);
    var targetTmdbId = data.tmdb_id || data.id;

    var streams = await searchAndFetch(
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
}

if (typeof getStreams === "function") {
  var _origGetStreams = getStreams;
  getStreams = async function() {
    var res = await _origGetStreams.apply(this, arguments);
    return sortStreamsByQuality(res);
  };
}

if (typeof module !== "undefined") module.exports = wrapAll({ getStreams, getMeta, getCatalog }, cfgReady);
if (typeof globalThis !== "undefined") {
  globalThis.getStreams = getStreams;
  globalThis.getMeta = getMeta;
  globalThis.getCatalog = getCatalog;
}

if (typeof globalThis !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  if (module.exports.getStreams) globalThis.getStreams = module.exports.getStreams;
  if (module.exports.getCatalog) globalThis.getCatalog = module.exports.getCatalog;
  if (module.exports.getMeta) globalThis.getMeta = module.exports.getMeta;
}
