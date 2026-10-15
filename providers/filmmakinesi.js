/**
 * Anthology Provider: filmmakinesi
 * Built from src/filmmakinesi/index.js
 * Build: v1.8.30 (anthology build system)
 */
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
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

// src/filmmakinesi/index.js
var { loadConfig, val, wrapAll } = require_config();
var _cfgReady = null;
function cfgReady() {
  if (!_cfgReady) {
    _cfgReady = loadConfig().then(function() {
      var v;
      v = val("urls.series.filmmakinesi.base") || val("urls.movies.filmmakinesi.base");
      if (v) BASE_URL = String(v).replace(/\/+$/, "");
      if (HEADERS) HEADERS.Referer = BASE_URL + "/";
    });
  }
  return _cfgReady;
}
var BASE_URL = "https://filmmakinesi.to";
var TMDB_API_KEY = "500330721680edb6d5f7f12ba7cd9023";
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
  "Referer": BASE_URL + "/"
};
var CLOSELOAD_HEADERS = {
  "User-Agent": HEADERS["User-Agent"],
  "Referer": "https://closeload.filmmakinesi.to/"
};
var SLUG_CACHE = /* @__PURE__ */ new Map();
var SERIES_MAP = {
  "tt1586680": "shameless-2011",
  "shameless": "shameless-2011",
  "tt0903747": "breaking-bad-izle",
  "breaking-bad": "breaking-bad-izle",
  "tt8633478": "chernobyl-izle",
  "chernobyl": "chernobyl-izle",
  "tt0460681": "supernatural-izle",
  "supernatural": "supernatural-izle",
  "tt4574334": "stranger-things-izle",
  "stranger-things": "stranger-things-izle",
  "tt1190634": "the-boys-izle",
  "the-boys": "the-boys-izle",
  "tt0773262": "dexter-izle",
  "dexter": "dexter-izle",
  "tt0455275": "prison-break-izle",
  "prison-break": "prison-break-izle",
  "tt11198330": "house-of-the-dragon-izle",
  "house-of-the-dragon": "house-of-the-dragon-izle",
  "tt3581920": "the-last-of-us-izle",
  "the-last-of-us": "the-last-of-us-izle",
  "tt2442560": "peaky-blinders-izle",
  "peaky-blinders": "peaky-blinders-izle"
};
var FILM_MAP = {
  "tt15398776": "oppenheimer-izle-2023-fm3",
  "872585": "oppenheimer-izle-2023-fm3",
  "tt10366206": "john-wick-4-izle-2023-fm1",
  "603692": "john-wick-4-izle-2023-fm1",
  "tt0133093": "matrix-izle-1999",
  "603": "matrix-izle-1999",
  "tt0468569": "kara-sovalye-izle-2008",
  "155": "kara-sovalye-izle-2008"
};
function fetchWithTimeout(url, options, ms) {
  return __async(this, null, function* () {
    var opts = options || {};
    try {
      if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
        opts.signal = AbortSignal.timeout(ms || 1e4);
      }
    } catch (e) {
    }
    try {
      var res = yield fetch(url, opts);
      if (res && res.status !== 403) {
        return res;
      }
    } catch (e) {
    }
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      try {
        var cp = require("child_process");
        var headers = opts.headers || {};
        var cmd = "curl -s --http1.1 ";
        for (var k in headers) {
          cmd += "-H " + JSON.stringify(k + ": " + headers[k]) + " ";
        }
        cmd += JSON.stringify(url);
        var text = cp.execSync(cmd, { maxBuffer: 15 * 1024 * 1024 }).toString();
        return {
          ok: true,
          status: 200,
          text: function() {
            return __async(this, null, function* () {
              return text;
            });
          },
          json: function() {
            return __async(this, null, function* () {
              return JSON.parse(text);
            });
          }
        };
      } catch (e) {
      }
    }
    return { ok: false, status: 403, text: function() {
      return __async(this, null, function* () {
        return "";
      });
    }, json: function() {
      return __async(this, null, function* () {
        return {};
      });
    } };
  });
}
function slugify(text) {
  if (!text) return "";
  return text.toString().toLowerCase().replace(/[ıİ]/g, "i").replace(/[üÜ]/g, "u").replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[ğĞ]/g, "g").replace(/[çÇ]/g, "c").replace(/[âÂ]/g, "a").replace(/[îÎ]/g, "i").replace(/[ûÛ]/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function resolveTmdbInfo(id, mediaType) {
  return __async(this, null, function* () {
    try {
      var cleanId = String(id || "").trim();
      if (cleanId.includes(":")) cleanId = cleanId.split(":")[0];
      var titleTr = "";
      var titleEn = "";
      var year = "";
      var imdbId = "";
      var tmdbId = "";
      var isSeries = mediaType === "tv" || mediaType === "series";
      if (cleanId.startsWith("tt")) {
        imdbId = cleanId;
        var findUrl = "https://api.themoviedb.org/3/find/" + cleanId + "?api_key=" + TMDB_API_KEY + "&external_source=imdb_id&language=tr-TR";
        var findRes = yield fetchWithTimeout(findUrl, {}, 8e3);
        if (findRes.ok) {
          var fd = yield findRes.json();
          var match = isSeries ? fd.tv_results && fd.tv_results[0] || fd.movie_results && fd.movie_results[0] : fd.movie_results && fd.movie_results[0] || fd.tv_results && fd.tv_results[0];
          if (match) {
            titleTr = match.name || match.title || "";
            titleEn = match.original_name || match.original_title || "";
            year = (match.first_air_date || match.release_date || "").split("-")[0];
            tmdbId = String(match.id || "");
          }
        }
      } else if (/^\d+$/.test(cleanId)) {
        tmdbId = cleanId;
        var endpoint = isSeries ? "tv" : "movie";
        var detailsUrl = "https://api.themoviedb.org/3/" + endpoint + "/" + cleanId + "?api_key=" + TMDB_API_KEY + "&language=tr-TR";
        var mRes = yield fetchWithTimeout(detailsUrl, {}, 8e3);
        if (mRes.ok) {
          var md = yield mRes.json();
          titleTr = md.name || md.title || "";
          titleEn = md.original_name || md.original_title || "";
          year = (md.first_air_date || md.release_date || "").split("-")[0];
          imdbId = md.external_ids && md.external_ids.imdb_id || md.imdb_id || "";
        }
      }
      return {
        titleTr,
        titleEn,
        year,
        imdbId,
        tmdbId
      };
    } catch (e) {
      return { titleTr: "", titleEn: "", year: "", imdbId: "", tmdbId: "" };
    }
  });
}
function searchFilmMakinesi(query, isTv) {
  return __async(this, null, function* () {
    try {
      var searchUrl = BASE_URL + "/arama/?s=" + encodeURIComponent(query);
      var res = yield fetchWithTimeout(searchUrl, { headers: HEADERS }, 6e3);
      if (!res.ok) return [];
      var html = yield res.text();
      var targetPrefix = isTv ? "/dizi/" : "/film/";
      var regex = new RegExp(`href=["']((?:https://filmmakinesi\\.to)?` + targetPrefix + `([a-zA-Z0-9-]+)/)["']`, "gi");
      var slugs = [];
      var m;
      while ((m = regex.exec(html)) !== null) {
        var slug = m[2];
        if (slug && slugs.indexOf(slug) === -1) {
          slugs.push(slug);
        }
      }
      return slugs;
    } catch (e) {
      return [];
    }
  });
}
function findSlug(rawId, isTv, seasonNum, episodeNum) {
  return __async(this, null, function* () {
    var cleanId = String(rawId || "").trim();
    if (cleanId.includes(":")) cleanId = cleanId.split(":")[0];
    var map = isTv ? SERIES_MAP : FILM_MAP;
    if (map[cleanId]) return map[cleanId];
    var cacheKey = (isTv ? "tv:" : "movie:") + cleanId;
    if (SLUG_CACHE.has(cacheKey)) return SLUG_CACHE.get(cacheKey);
    var info = yield resolveTmdbInfo(cleanId, isTv ? "tv" : "movie");
    if (info.imdbId && map[info.imdbId]) {
      SLUG_CACHE.set(cacheKey, map[info.imdbId]);
      return map[info.imdbId];
    }
    if (info.imdbId) {
      var slugsByImdb = yield searchFilmMakinesi(info.imdbId, isTv);
      if (slugsByImdb.length > 0) {
        SLUG_CACHE.set(cacheKey, slugsByImdb[0]);
        map[info.imdbId] = slugsByImdb[0];
        return slugsByImdb[0];
      }
    }
    var candidates = [];
    var enSlug = slugify(info.titleEn);
    var trSlug = slugify(info.titleTr);
    var year = info.year;
    if (enSlug) {
      candidates.push(enSlug);
      candidates.push(enSlug + "-izle");
      if (year) {
        candidates.push(enSlug + "-" + year);
        candidates.push(enSlug + "-izle-" + year);
      }
    }
    if (trSlug && trSlug !== enSlug) {
      candidates.push(trSlug);
      candidates.push(trSlug + "-izle");
      if (year) {
        candidates.push(trSlug + "-" + year);
        candidates.push(trSlug + "-izle-" + year);
      }
    }
    var sNum = seasonNum || 1;
    var eNum = episodeNum || 1;
    for (var i = 0; i < candidates.length; i++) {
      var cand = candidates[i];
      var checkUrl = isTv ? BASE_URL + "/dizi/" + cand + "/sezon-" + sNum + "/bolum-" + eNum + "/" : BASE_URL + "/film/" + cand + "/";
      try {
        var cRes = yield fetchWithTimeout(checkUrl, { headers: HEADERS }, 5e3);
        if (cRes.status === 200) {
          SLUG_CACHE.set(cacheKey, cand);
          if (info.imdbId) map[info.imdbId] = cand;
          return cand;
        }
      } catch (e) {
      }
    }
    if (info.titleEn) {
      var slugsByTitle = yield searchFilmMakinesi(info.titleEn, isTv);
      if (slugsByTitle.length > 0) {
        SLUG_CACHE.set(cacheKey, slugsByTitle[0]);
        return slugsByTitle[0];
      }
    }
    return null;
  });
}
function decryptCloseLoadScript(scriptContent) {
  try {
    var m = scriptContent.match(/var\s+([a-zA-Z0-9_$]+)\s*=\s*[a-zA-Z0-9_$]+\(\[[^\]]+\]\);/);
    if (!m) return null;
    var varName = m[1];
    var code = [
      'var atob = (typeof globalThis.atob !== "undefined") ? globalThis.atob : function(s) {',
      '  return Buffer.from(s, "base64").toString("binary");',
      "};",
      'var btoa = (typeof globalThis.btoa !== "undefined") ? globalThis.btoa : function(s) {',
      '  return Buffer.from(s, "binary").toString("base64");',
      "};",
      scriptContent,
      "return " + varName + ";"
    ].join("\n");
    return new Function(code)();
  } catch (e) {
    return null;
  }
}
function resolveCloseLoadStreams(pageUrl) {
  return __async(this, null, function* () {
    try {
      var res = yield fetchWithTimeout(pageUrl, { headers: HEADERS }, 1e4);
      if (!res.ok) return null;
      var html = yield res.text();
      var ifrMatch = html.match(/data-src="([^"]*video\/embed[^"]*)"/i) || html.match(/<iframe[^>]+src="([^"]*video\/embed[^"]*)"/i) || html.match(/<iframe[^>]+src="([^"]*closeload[^"]*)"/i);
      if (!ifrMatch) return null;
      var embedUrl = ifrMatch[1];
      if (embedUrl.startsWith("//")) embedUrl = "https:" + embedUrl;
      var eRes = yield fetchWithTimeout(embedUrl, {
        headers: {
          "User-Agent": HEADERS["User-Agent"],
          "Referer": BASE_URL + "/"
        }
      }, 1e4);
      if (!eRes.ok) return null;
      var eHtml = yield eRes.text();
      var scripts = Array.from(eHtml.matchAll(/<script[\s\S]*?<\/script>/gi)).map(function(m) {
        return m[0];
      });
      var streamUrl = null;
      var fileVarMatch = eHtml.match(/sources:\s*\[\{\s*file:\s*([a-zA-Z0-9_$]+)/);
      if (fileVarMatch) {
        var targetVar = fileVarMatch[1];
        for (var sIdx = 0; sIdx < scripts.length; sIdx++) {
          var s = scripts[sIdx];
          if (s.includes("var " + targetVar + " =") || s.includes("var " + targetVar + "=")) {
            var cleanScriptA = s.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
            var codeA = [
              'var atob = (typeof globalThis.atob !== "undefined") ? globalThis.atob : function(s) {',
              '  return Buffer.from(s, "base64").toString("binary");',
              "};",
              'var btoa = (typeof globalThis.btoa !== "undefined") ? globalThis.btoa : function(s) {',
              '  return Buffer.from(s, "binary").toString("base64");',
              "};",
              cleanScriptA,
              "return " + targetVar + ";"
            ].join("\n");
            try {
              var decA = new Function(codeA)();
              if (decA && typeof decA === "string" && decA.startsWith("http")) {
                streamUrl = decA;
                break;
              }
            } catch (e) {
            }
          }
        }
      }
      if (!streamUrl) {
        for (var i = 0; i < scripts.length; i++) {
          var sB = scripts[i];
          if (sB.includes("var ") && sB.includes("([") && (sB.includes("btoa") || sB.includes("atob") || sB.includes("join"))) {
            var cleanScriptB = sB.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
            var decB = decryptCloseLoadScript(cleanScriptB);
            if (decB && typeof decB === "string" && decB.startsWith("http")) {
              streamUrl = decB;
              break;
            }
          }
        }
      }
      if (!streamUrl) return null;
      var subtitles = [];
      var tracksMatch = eHtml.match(/tracks:\s*(\[[^\]]+\])/i);
      if (tracksMatch) {
        try {
          var rawTracks = JSON.parse(tracksMatch[1]);
          for (var tIdx = 0; tIdx < rawTracks.length; tIdx++) {
            var t = rawTracks[tIdx];
            if (t.file && t.kind === "captions") {
              var label = t.label || "Subtitle";
              var lowerLabel = label.toLowerCase();
              var langCode = "tr";
              var isoLang = "tur";
              if (lowerLabel.includes("eng") || lowerLabel.includes("ing")) {
                langCode = "en";
                isoLang = "eng";
              } else if (lowerLabel.includes("tur") || lowerLabel.includes("t\xFCrk")) {
                langCode = "tr";
                isoLang = "tur";
              } else if (lowerLabel.includes("ger") || lowerLabel.includes("alm")) {
                langCode = "de";
                isoLang = "ger";
              } else if (lowerLabel.includes("fre") || lowerLabel.includes("fra")) {
                langCode = "fr";
                isoLang = "fre";
              } else if (lowerLabel.includes("spa") || lowerLabel.includes("isp")) {
                langCode = "es";
                isoLang = "spa";
              }
              subtitles.push({
                id: "fm_sub_" + tIdx,
                url: t.file,
                file: t.file,
                link: t.file,
                lang: isoLang,
                language: langCode,
                label,
                name: label,
                title: label,
                format: "vtt",
                type: "text/vtt",
                mimeType: "text/vtt",
                headers: CLOSELOAD_HEADERS
              });
            }
          }
        } catch (e) {
        }
      }
      return {
        streamUrl,
        subtitles
      };
    } catch (e) {
      return null;
    }
  });
}
function getStreams(tmdbIdOrArgs, mediaType, seasonNum, episodeNum) {
  return __async(this, null, function* () {
    try {
      var rawId = tmdbIdOrArgs;
      var finalSeason = seasonNum;
      var finalEpisode = episodeNum;
      if (typeof tmdbIdOrArgs === "object" && tmdbIdOrArgs !== null) {
        rawId = tmdbIdOrArgs.id || "";
        mediaType = mediaType || tmdbIdOrArgs.type || tmdbIdOrArgs.mediaType;
        if (tmdbIdOrArgs.season) finalSeason = tmdbIdOrArgs.season;
        if (tmdbIdOrArgs.episode) finalEpisode = tmdbIdOrArgs.episode;
      }
      if (!rawId) return [];
      var isTv = mediaType === "tv" || mediaType === "series";
      if (typeof rawId === "string" && rawId.includes(":")) {
        var parts = rawId.split(":");
        if (parts.length >= 3) {
          isTv = true;
          var s = parseInt(parts[parts.length - 2]);
          var e = parseInt(parts[parts.length - 1]);
          if (!isNaN(s)) finalSeason = s;
          if (!isNaN(e)) finalEpisode = e;
        }
      }
      finalSeason = parseInt(finalSeason) || 1;
      finalEpisode = parseInt(finalEpisode) || 1;
      var slug = yield findSlug(rawId, isTv, finalSeason, finalEpisode);
      if (!slug) return [];
      var pageUrl = isTv ? BASE_URL + "/dizi/" + slug + "/sezon-" + finalSeason + "/bolum-" + finalEpisode + "/" : BASE_URL + "/film/" + slug + "/";
      var resolved = yield resolveCloseLoadStreams(pageUrl);
      if (!resolved || !resolved.streamUrl) return [];
      var masterUrl = resolved.streamUrl;
      var playUrl = masterUrl.includes("#") ? masterUrl : masterUrl + "#.m3u8";
      var streamTitle = isTv ? "FilmMakinesi - S" + finalSeason + "E" + finalEpisode + " [Dual: TR Dublaj / Orijinal] 1080p" : "FilmMakinesi - 1080p [Dual: TR Dublaj / Orijinal]";
      return [{
        name: "FilmMakinesi [CloseLoad]",
        title: streamTitle,
        url: playUrl,
        quality: "1080p",
        format: "hls",
        isHls: true,
        contentLanguage: ["tr", "en"],
        behaviorHints: {
          headers: CLOSELOAD_HEADERS
        },
        headers: CLOSELOAD_HEADERS,
        subtitles: resolved.subtitles
      }];
    } catch (e2) {
      return [];
    }
  });
}
function getCatalog(args) {
  return __async(this, null, function* () {
    try {
      var res = yield fetchWithTimeout(BASE_URL + "/", { headers: HEADERS }, 8e3);
      if (!res.ok) return { metas: [] };
      var html = yield res.text();
      var matches = Array.from(html.matchAll(/href=["'](?:https:\/\/filmmakinesi\.to)?\/film\/([a-zA-Z0-9-]+)\/["'][^>]*title=["']([^"']*)["']/gi));
      var metas = [];
      var seen = /* @__PURE__ */ new Set();
      for (var i = 0; i < matches.length; i++) {
        var slug = matches[i][1];
        var title = matches[i][2] || slug;
        if (!seen.has(slug)) {
          seen.add(slug);
          metas.push({
            id: "filmmakinesi:movie:" + slug,
            type: "movie",
            name: title,
            poster: "https://raw.githubusercontent.com/falsisdev/anthology/main/assets/logo_1_transparent.png",
            genres: ["Film", "FilmMakinesi"]
          });
          if (metas.length >= 30) break;
        }
      }
      return { metas };
    } catch (e) {
      return { metas: [] };
    }
  });
}
function getMeta(args) {
  return __async(this, null, function* () {
    try {
      var rawId = typeof args === "string" ? args : args && args.id ? args.id : "";
      var slug = rawId.replace("filmmakinesi:movie:", "").replace("filmmakinesi:series:", "");
      return {
        meta: {
          id: rawId,
          type: rawId.includes("series") ? "series" : "movie",
          name: slug,
          poster: "https://raw.githubusercontent.com/falsisdev/anthology/main/assets/logo_1_transparent.png"
        }
      };
    } catch (e) {
      return { meta: null };
    }
  });
}
function sortStreamsByQuality(streams) {
  if (!Array.isArray(streams) || streams.length <= 1) return streams || [];
  function getQualityScore(s) {
    if (!s) return 0;
    var score = 0;
    var text = ((s.title || "") + " " + (s.name || "") + " " + (s.quality || "")).toLowerCase();
    if (/\b(4k|2160p|uhd)\b/.test(text)) score = 2160;
    else if (/\b(2k|1440p|qhd)\b/.test(text)) score = 1440;
    else if (/\b(1080p|fhd|full[\s-]?hd)\b/.test(text)) score = 1080;
    else if (/\b(720p)\b/.test(text)) score = 720;
    else if (/\b(540p)\b/.test(text)) score = 540;
    else if (/\b(480p)\b/.test(text)) score = 480;
    else if (/\b(360p)\b/.test(text)) score = 360;
    if (!score && s.url) {
      var u = String(s.url).toLowerCase();
      if (/[\/_.-](2160p?|4k)[\/_.-]/.test(u)) score = 2160;
      else if (/[\/_.-](1440p?|2k)[\/_.-]/.test(u)) score = 1440;
      else if (/[\/_.-](1080p?|fhd)[\/_.-]/.test(u)) score = 1080;
      else if (/[\/_.-](720p?|hd)[\/_.-]/.test(u)) score = 720;
      else if (/[\/_.-](480p?|sd)[\/_.-]/.test(u)) score = 480;
    }
    var isDirectMp4 = s.format === "mp4" || s.type === "mp4" || !s.isHls && s.url && (s.url.endsWith(".mp4") || s.url.includes(".mp4?"));
    if (isDirectMp4 && score > 0) score += 1;
    return score;
  }
  return streams.slice().sort(function(a, b) {
    return getQualityScore(b) - getQualityScore(a);
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
if (typeof module !== "undefined") module.exports = wrapAll({ getStreams, getCatalog, getMeta }, cfgReady);
if (typeof globalThis !== "undefined") {
  globalThis.getStreams = getStreams;
  globalThis.getCatalog = getCatalog;
  globalThis.getMeta = getMeta;
}

if (typeof globalThis !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    if (module.exports.getStreams) globalThis.getStreams = module.exports.getStreams;
    if (module.exports.getCatalog) globalThis.getCatalog = module.exports.getCatalog;
    if (module.exports.getMeta) globalThis.getMeta = module.exports.getMeta;
    if (module.exports.getSubtitles) globalThis.getSubtitles = module.exports.getSubtitles;
}

