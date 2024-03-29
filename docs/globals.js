const ADDRESS0 = "0x0000000000000000000000000000000000000000";
const ENSADDRESS = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";
const MILLISPERDAY = 60 * 60 * 24 * 1000;
const SECONDSPERHOUR = 60 * 60;
const SECONDSPERDAY = 60 * 60 * 24;
const ENSSUBGRAPHURL = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
const ENSSUBGRAPHBATCHSIZE = 250;
const ENSSUBGRAPHBATCHSCANSIZE = 250;

const CRYPTOPUNKSSUBGRAPHURL = "https://api.thegraph.com/subgraphs/name/itsjerryokolo/cryptopunks";
const CRYPTOPUNKSSUBGRAPHBATCHSIZE = 250;

const BLOCKTIMESTAMPSUBGRAPHURL = "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks";

const ENSSUBGRAPHNAMEQUERY = `
  query getRegistrations($labelNames: [String!]!) {
    registrations(first: 1000, orderBy: labelName, orderDirection: asc, where: { labelName_in: $labelNames }) {
      id
      registrationDate
      expiryDate
      cost
      registrant {
        id
      }
      labelName
      domain {
        id
        labelName
        labelhash
        name
        isMigrated
        resolver {
          address
          coinTypes
          texts
        }
        resolvedAddress {
          id
        }
        parent {
          labelName
          labelhash
          name
        }
        owner {
          id
        }
        events {
          id
          blockNumber
          transactionID
          __typename
        }
      }
      events {
        id
        blockNumber
        transactionID
        __typename
      }
    }
  }
`;

const ENSSUBGRAPHNAMECONTAINSQUERY = `
  query getRegistrations($labelName: String!, $first: Int, $skip: Int) {
    registrations(first: $first, skip: $skip, orderBy: labelName, orderDirection: asc, where: {labelName_contains: $labelName}) {
      id
      registrationDate
      expiryDate
      cost
      registrant {
        id
      }
      labelName
      domain {
        id
        labelName
        labelhash
        name
        isMigrated
        resolver {
          address
          coinTypes
          texts
        }
        resolvedAddress {
          id
        }
        parent {
          labelName
          labelhash
          name
        }
        owner {
          id
        }
        events {
          id
          blockNumber
          transactionID
          __typename
        }
      }
    }
  }
`;

const ENSSUBGRAPHNAMESTARTSWITHQUERY = `
  query getRegistrations($labelName: String!, $first: Int, $skip: Int) {
    registrations(first: $first, skip: $skip, orderBy: labelName, orderDirection: asc, where: {labelName_starts_with: $labelName}) {
      id
      registrationDate
      expiryDate
      cost
      registrant {
        id
      }
      labelName
      domain {
        id
        labelName
        labelhash
        name
        isMigrated
        resolver {
          address
          coinTypes
          texts
        }
        resolvedAddress {
          id
        }
        parent {
          labelName
          labelhash
          name
        }
        owner {
          id
        }
        events {
          id
          blockNumber
          transactionID
          __typename
        }
    }
    }
  }
`;

const ENSSUBGRAPHNAMEENDSWITHQUERY = `
  query getRegistrations($labelName: String!, $first: Int, $skip: Int) {
    registrations(first: $first, skip: $skip, orderBy: labelName, orderDirection: asc, where: {labelName_ends_with: $labelName}) {
      id
      registrationDate
      expiryDate
      cost
      registrant {
        id
      }
      labelName
      domain {
        id
        labelName
        labelhash
        name
        isMigrated
        resolver {
          address
          coinTypes
          texts
        }
        resolvedAddress {
          id
        }
        parent {
          labelName
          labelhash
          name
        }
        owner {
          id
        }
        events {
          id
          blockNumber
          transactionID
          __typename
        }
      }
    }
  }
`;

const ENSSUBGRAPHOWNEDQUERY = `
  query getRegistrations($id: ID!, $first: Int, $skip: Int, $orderBy: Registration_orderBy, $orderDirection: OrderDirection, $expiryDate: Int) {
    account(id: $id) {
      registrations(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: {expiryDate_gt: $expiryDate}) {
        id
        registrationDate
        expiryDate
        cost
        registrant {
          id
        }
        labelName
        domain {
          id
          labelName
          labelhash
          name
          isMigrated
          resolver {
            address
            coinTypes
            texts
          }
          resolvedAddress {
            id
          }
          parent {
            labelName
            labelhash
            name
          }
          owner {
            id
          }
          events {
            id
            blockNumber
            transactionID
            __typename
          }
        }
        events {
          id
          blockNumber
          transactionID
          __typename
        }
      }
    }
  }
`;

const ENSSUBGRAPHBBYTOKENIDSQUERY = `
  query getRegistrationsByTokenIds($tokenIds: [String!]!) {
    registrations(first: 1000, skip: 0, where: { id_in: $tokenIds }) {
      id
      registrationDate
      expiryDate
      cost
      registrant {
        id
      }
      labelName
      domain {
        id
        labelName
        labelhash
        name
        isMigrated
        resolver {
          address
          coinTypes
          texts
        }
        resolvedAddress {
          id
        }
        parent {
          labelName
          labelhash
          name
        }
        owner {
          id
        }
      }
    }
  }
`;

const CRYPTOPUNKSPUNKBYIDSQUERY = `
  query getPunksByIds($ids: [Int!]!) {
    punks(first: 1000, skip: 0, where: { id_in: $ids }) {
      id
      metadata {
        tokenURI
        image
        svg
        traits {
          id
        }
      }
      transferedTo {
        id
      }
      assignedTo {
        id
      }
      purchasedBy {
        id
      }
      owner {
        id
      }
      wrapped
      currentAsk {
        amount
        open
      }
      currentBid {
        amount
        open
      }
      events(first: 1000) {
        from {
          id
        }
        to {
          id
        }
        amount
        type
        blockNumber
        logNumber
        blockHash
        txHash
        timestamp
      }
    }
  }
`;

const CRYPTOPUNKSEVENTSBYTIMESTAMPQUERY = `
  query getPunkEvents($timestamp_gt: Int!) {
    events(orderBy: timestamp, orderDirection: asc, first: 250, skip: 0, where: { timestamp_gt: $timestamp_gt }) {
      nft {
        id
      }
      from {
        id
      }
      to {
        id
      }
      amount
      type
      blockNumber
      logNumber
      blockHash
      txHash
      timestamp
    }
  }
`;

const BLOCKTIMESTAMPAFTERQUERY = `
  query getEarliestTimestampAfter($timestamp: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gte: $timestamp }) {
      number
      timestamp
    }
  }
`;

const BLOCKTIMESTAMPBEFOREQUERY = `
  query getEarliestTimestampBefore($timestamp: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_lte: $timestamp }) {
      number
      timestamp
    }
  }
`;

const PUNKTRAITS = {
  "body" : ["alien", "ape", "female", "female-1", "female-2", "female-3", "female-4", "male", "male-1", "male-2", "male-3", "male-4", "zombie"],
  "chinstrap" : ["chinstrap"],
  "clown-nose" : ["clown-nose"],
  "earring" : ["earring"],
  "eyes": ["3d-glasses", "big-shades", "blue-eye-shadow", "classic-shades", "clown-eyes-blue", "clown-eyes-green", "eye-mask", "eye-patch", "green-eye-shadow", "horned-rim-glasses", "nerd-glasses", "purple-eye-shadow", "regular-shades", "small-shades", "vr", "welding-goggles"],
  "feature" : ["buck-teeth", "rosy-cheeks", "spots"],
  "frown" : ["frown"],
  "hair": ["blonde-short", "cap", "clown-hair-green", "crazy-hair", "dark-hair", "frumpy-hair", "half-shaved", "messy-hair", "mohawk", "mohawk-dark", "mohawk-thin", "orange-side", "peak-spike", "pigtails", "purple-hair", "red-mohawk", "shaved-head", "straight-hair", "straight-hair-blonde", "straight-hair-dark", "stringy-hair", "vampire-hair", "wild-blonde", "wild-hair", "wild-white-hair"],
  "hat": ["bandana", "beanie", "blonde-bob", "cap-forward", "cowboy-hat", "do-rag", "fedora", "knitted-cap", "hoodie", "pilot-helmet", "pink-with-hat", "police-cap", "tassle-hat", "tiara", "top-hat"],
  "headband": ["headband"],
  "mole": ["mole"],
  "mouth": ["big-beard", "black-lipstick", "front-beard", "front-beard-dark", "goat", "handlebars", "hot-lipstick", "luxurious-beard", "muttonchops", "normal-beard", "normal-beard-black", "purple-lipstick", "shadow-beard"],
  "mouthext": ["cigarette", "medical-mask", "pipe", "vape"],
  "mustache": ["mustache"],
  "smile": ["smile"],
  "special": ["choker", "gold-chain", "silver-chain"],
};


function formatNumber(n) {
    return n == null ? "" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var logLevel = 1;
// 0 = NONE, 1 = INFO (default), 2 = DEBUG
function setLogLevel(_logLevel) {
  logLevel = _logLevel;
}

function logDebug(s, t) {
  if (logLevel > 1) {
    console.log(new Date().toLocaleTimeString() + " DEBUG " + s + ":" + t);
  }
}

function logInfo(s, t) {
  if (logLevel > 0) {
    console.log(new Date().toLocaleTimeString() + " INFO " + s + ":" + t);
  }
}

function logError(s, t) {
  console.error(new Date().toLocaleTimeString() + " ERROR " + s + ":" + t);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

// https://stackoverflow.com/questions/33702838/how-to-append-bytes-multi-bytes-and-buffer-to-arraybuffer-in-javascript
function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}
function concatBuffers(a, b) {
    return concatTypedArrays(
        new Uint8Array(a.buffer || a),
        new Uint8Array(b.buffer || b)
    ).buffer;
}
function concatBytesOld(ui8a, byte) {
    var b = new Uint8Array(1);
    b[0] = byte;
    return concatTypedArrays(ui8a, b);
}

function concatByte(ui8a, byte) {
    var view = new Uint8Array(ui8a);
    var result = new Uint8Array(view.length + 1);
    var i;
    for (i = 0; i < view.length; i++) {
      result[i] = view[i];
    }
    result[view.length] = byte;
    return result;
}

function concatBytes(ui8a, ui8b) {
    var viewa = new Uint8Array(ui8a);
    var viewb = new Uint8Array(ui8b);
    var result = new Uint8Array(viewa.length + viewb.length);
    var i;
    var offset = 0;
    for (i = 0; i < viewa.length; i++) {
      result[offset++] = viewa[i];
    }
    for (i = 0; i < viewb.length; i++) {
      result[offset++] = viewb[i];
    }
    return result;
}

function ethereumSignedMessageHashOfText(text) {
  var hashOfText = keccak256.array(text);
  return ethereumSignedMessageHashOfHash(hashOfText);
}

function ethereumSignedMessageHashOfHash(hash) {
  // https://github.com/emn178/js-sha3
  var data = new Uint8Array("");
  var data1 = concatByte(data, 0x19);
  var ethereumSignedMessageBytes = new TextEncoder("utf-8").encode("Ethereum Signed Message:\n32");
  var data2 = concatBytes(data1, ethereumSignedMessageBytes);
  var data3 = concatBytes(data2, hash);
  return "0x" + toHexString(keccak256.array(data3));
}

function parseToText(item) {
  if (item == null) {
    return "(null)";
  } else if (Array.isArray(item)) {
    return JSON.stringify(item);
  } else if (typeof item === "object") {
    return JSON.stringify(item);
  } else {
    return item;
  }
}

// function escapeJSON(j) {
//
// }

// https://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks
// with my addition of the finalised variable in the callback
function parseFile(file, callback) {
    var fileSize   = file.size;
    var chunkSize  = 64 * 1024; // bytes
    // var chunkSize  = 1; // bytes
    var offset     = 0;
    var self       = this; // we need a reference to the current object
    var chunkReaderBlock = null;

    var readEventHandler = function(evt) {
        if (evt.target.error == null) {
            offset += evt.target.result.byteLength;
            callback(evt.target.result, offset <= chunkSize, false); // callback for handling read chunk
        } else {
            console.log("Read error: " + evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            callback("", false, true);
            return;
        }

        // of to the next chunk
        chunkReaderBlock(offset, chunkSize, file);
    }

    chunkReaderBlock = function(_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = readEventHandler;
        r.readAsArrayBuffer(blob);
    }

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
}

// baseUrl: http://x.y.z/media/list
// filter : { a: 1, b: 2, c: 3 }
// fields: [ "a", "b", "c" ]
function buildFilterUrl(baseUrl, filter, fields) {
  var url = baseUrl;
  var separator = "?";
  fields.forEach(function(f) {
    if (filter[f] !== undefined && filter[f] !== null && filter[f] !== "") {
      url = url + separator + f + "=" + filter[f];
      separator = "&";
    }
  })
  return encodeURI(url);
}


function getTermFromSeconds(term) {
  if (term > 0) {
    var secs = parseInt(term);
    var mins = parseInt(secs / 60);
    secs = secs % 60;
    var hours = parseInt(mins / 60);
    mins = mins % 60;
    var days = parseInt(hours / 24);
    hours = hours % 24;
    var s = "";
    if (days > 0) {
      s += days + "d ";
    }
    if (hours > 0) {
      s += hours + "h ";
    }
    if (mins > 0) {
      s += mins + "m ";
    }
    if (secs > 0) {
      s += secs + "s";
    }
    return s;
  } else {
    return "";
  }
}


// https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
function chunkArray(myArray, chunk_size) {
  var results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }
  return results;
}

function slugToTitle(slug) {
  var words = slug.toString().split("-");
  return words.map(function(word) {
    if (word == "3d" || word == "vr") {
      return word.toUpperCase();
    } else {
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    }
  }).join(' ');
}

const generateRange = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const delay = ms => new Promise(res => setTimeout(res, ms));

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

// https://stackoverflow.com/a/22590126
function maxCharacterCount(input) {
    const {max, ...counts} = (input || "").split("").reduce(
    (a, c) => {
        a[c] = a[c] ? a[c] + 1 : 1;
        a.max = a.max < a[c] ? a[c] : a.max;
        return a;
    },
    { max: 0 }
    );

    // return Object.entries(counts).filter(([k, v]) => v === max);
    return max;
}
