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

const CRYPTOPUNKSMARKETDEPLOYMENTBLOCK = 3914495;
const CRYPTOPUNKSMARKETADDRESS = "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb";
const CRYPTOPUNKSMARKETABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punksOfferedForSale","outputs":[{"name":"isForSale","type":"bool"},{"name":"punkIndex","type":"uint256"},{"name":"seller","type":"address"},{"name":"minValue","type":"uint256"},{"name":"onlySellTo","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"enterBidForPunk","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minPrice","type":"uint256"}],"name":"acceptBidForPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"indices","type":"uint256[]"}],"name":"setInitialOwners","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"imageHash","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"nextPunkIndexToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punkIndexToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punkBids","outputs":[{"name":"hasBid","type":"bool"},{"name":"punkIndex","type":"uint256"},{"name":"bidder","type":"address"},{"name":"value","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"allInitialOwnersAssigned","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"allPunksAssigned","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"buyPunk","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"punkIndex","type":"uint256"}],"name":"transferPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"withdrawBidForPunk","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"punkIndex","type":"uint256"}],"name":"setInitialOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"},{"name":"toAddress","type":"address"}],"name":"offerPunkForSaleToAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"punksRemainingToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"}],"name":"offerPunkForSale","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"getPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"punkNoLongerForSale","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"punkIndex","type":"uint256"}],"name":"Assign","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"punkIndex","type":"uint256"}],"name":"PunkTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"minValue","type":"uint256"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"PunkOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"}],"name":"PunkBidEntered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"}],"name":"PunkBidWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"PunkBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"}],"name":"PunkNoLongerForSale","type":"event"}];

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
        subdomains {
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
        subdomains {
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
        subdomains {
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
        subdomains {
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
          subdomains {
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
        subdomains {
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


const IPCADDRESS = "0x011C77fa577c500dEeDaD364b8af9e8540b808C0";
const IPCABI = [{"constant":false, "inputs":[{"name":"_newGod", "type":"address"}], "name":"renounceGodhood", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"_interfaceId", "type":"bytes4"}], "name":"supportsInterface", "outputs":[{"name":"", "type":"bool"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"nameModificationLevelRequirement", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}], "name":"randomizeDna", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"name", "outputs":[{"name":"", "type":"string"}], "payable":false, "stateMutability":"pure", "type":"function"}, {"constant":true, "inputs":[{"name":"_tokenId", "type":"uint256"}], "name":"getApproved", "outputs":[{"name":"", "type":"address"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_to", "type":"address"}, {"name":"_tokenId", "type":"uint256"}], "name":"approve", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":true, "inputs":[], "name":"priceToChangeName", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_newAddress", "type":"address"}], "name":"updateIpcContract", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newPrice", "type":"uint256"}], "name":"setMaxIpcPrice", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newPrice", "type":"uint256"}], "name":"changePriceToModifyDna", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"ipcPriceInCents", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_adminToRemove", "type":"address"}], "name":"removeAdmin", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"totalSupply", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"getAllPositions", "outputs":[{"name":"", "type":"address[]"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"uint256"}], "name":"Ipcs", "outputs":[{"name":"name", "type":"string"}, {"name":"attributeSeed", "type":"bytes32"}, {"name":"dna", "type":"bytes32"}, {"name":"experience", "type":"uint128"}, {"name":"timeOfBirth", "type":"uint128"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_newMultiplier", "type":"uint256"}], "name":"changeCustomizationMultiplier", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_from", "type":"address"}, {"name":"_to", "type":"address"}, {"name":"_tokenId", "type":"uint256"}], "name":"transferFrom", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newUrl", "type":"string"}], "name":"updateIpcUrl", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcIdArray", "type":"uint256[]"}, {"name":"_xpIdArray", "type":"uint256[]"}], "name":"grantBulkXp", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"_owner", "type":"address"}, {"name":"_index", "type":"uint256"}], "name":"tokenOfOwnerByIndex", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_beneficiaryAddress", "type":"address"}, {"name":"_beneficiaryPrice", "type":"uint256"}], "name":"setSpecialPriceForAddress", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"getAdmins", "outputs":[{"name":"", "type":"address[]"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"uint256"}], "name":"ipcToMarketInfo", "outputs":[{"name":"sellPrice", "type":"uint32"}, {"name":"beneficiaryPrice", "type":"uint32"}, {"name":"beneficiaryAddress", "type":"address"}, {"name":"approvalAddress", "type":"address"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"uint256"}, {"name":"", "type":"uint256"}], "name":"ipcIdToExperience", "outputs":[{"name":"", "type":"bool"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[], "name":"withdraw", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_newPrice", "type":"uint256"}], "name":"setIpcPrice", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_newPrice", "type":"uint256"}], "name":"buyIpc", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"_from", "type":"address"}, {"name":"_to", "type":"address"}, {"name":"_tokenId", "type":"uint256"}], "name":"safeTransferFrom", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"_name", "type":"string"}, {"name":"_price", "type":"uint256"}], "name":"createRandomizedIpc", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"_name", "type":"string"}, {"name":"_price", "type":"uint256"}, {"name":"_owner", "type":"address"}], "name":"createAndAssignRandomizedIpc", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"_developer", "type":"address"}], "name":"experiencesOfDeveloper", "outputs":[{"name":"", "type":"uint256[]"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"_index", "type":"uint256"}], "name":"tokenByIndex", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"mostCurrentIpcAddress", "outputs":[{"name":"", "type":"address"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"maxIpcPrice", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"_tokenId", "type":"uint256"}], "name":"ownerOf", "outputs":[{"name":"owner", "type":"address"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"totalDevelopers", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[], "name":"releaseNewTranche", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_dna", "type":"bytes32"}], "name":"customizeDna", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"value", "type":"bool"}], "name":"setAutoTrancheRelease", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newAdmin", "type":"address"}], "name":"addAdmin", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"_owner", "type":"address"}], "name":"balanceOf", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"customizationPriceMultiplier", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"_ipcId", "type":"uint256"}], "name":"getIpcPriceInWei", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"totalIpcs", "outputs":[{"name":"", "type":"uint128"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"_ipcId", "type":"uint256"}], "name":"getIpc", "outputs":[{"name":"name", "type":"string"}, {"name":"attributeSeed", "type":"bytes32"}, {"name":"dna", "type":"bytes32"}, {"name":"experience", "type":"uint128"}, {"name":"timeOfBirth", "type":"uint128"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_newAmount", "type":"uint256"}], "name":"changeXpPrice", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_xpId", "type":"uint256"}], "name":"removeExperience", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"_owner", "type":"address"}], "name":"tokensOfOwner", "outputs":[{"name":"", "type":"uint256[]"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_newReq", "type":"uint256"}], "name":"changeNameModificationLevelRequirement", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"getXpPrice", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_address", "type":"address"}, {"name":"_name", "type":"string"}], "name":"setDeveloperName", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newAddress", "type":"address"}], "name":"updateMarketPriceContract", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newInterfaceId", "type":"bytes4"}], "name":"addSupportedInterface", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}], "name":"rollAttributes", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"symbol", "outputs":[{"name":"", "type":"string"}], "payable":false, "stateMutability":"pure", "type":"function"}, {"constant":false, "inputs":[{"name":"developer", "type":"address"}, {"name":"value", "type":"bool"}], "name":"changeDeveloperStatus", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_authorization", "type":"bool"}], "name":"changeAdminAuthorization", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[], "name":"dnaModificationLevelRequirement", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_operator", "type":"address"}, {"name":"_approved", "type":"bool"}], "name":"setApprovalForAll", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"uint256"}], "name":"ipcToOwner", "outputs":[{"name":"", "type":"address"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"priceToModifyDna", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_name", "type":"string"}, {"name":"_price", "type":"uint256"}, {"name":"_owner", "type":"address"}], "name":"createAndAssignIpcSeed", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":true, "inputs":[{"name":"_ipcId", "type":"uint256"}], "name":"getIpcName", "outputs":[{"name":"result", "type":"bytes32"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_newCashier", "type":"address"}], "name":"setCashier", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newPriceIncrease", "type":"uint256"}], "name":"changePriceIncreasePerTranche", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_description", "type":"string"}], "name":"registerNewExperience", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newSize", "type":"uint256"}], "name":"changeTrancheSize", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_from", "type":"address"}, {"name":"_to", "type":"address"}, {"name":"_tokenId", "type":"uint256"}, {"name":"data", "type":"bytes"}], "name":"safeTransferFrom", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"_interfaceId", "type":"bytes4"}], "name":"removeSupportedInterface", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_name", "type":"string"}, {"name":"_price", "type":"uint256"}], "name":"createIpcSeed", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":true, "inputs":[{"name":"_tokenId", "type":"uint256"}], "name":"tokenURI", "outputs":[{"name":"", "type":"string"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[], "name":"getXpBalance", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"uint256"}], "name":"experiences", "outputs":[{"name":"developer", "type":"address"}, {"name":"description", "type":"string"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[], "name":"buyXp", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":true, "inputs":[{"name":"", "type":"address"}], "name":"ownerIpcCount", "outputs":[{"name":"", "type":"uint256"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_byteToModify", "type":"uint256"}, {"name":"_modifyAmount", "type":"int256"}], "name":"modifyDna", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":false, "inputs":[{"name":"_newReq", "type":"uint256"}], "name":"changeDnaModificationLevelRequirement", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_newName", "type":"string"}], "name":"changeIpcName", "outputs":[], "payable":true, "stateMutability":"payable", "type":"function"}, {"constant":true, "inputs":[{"name":"_owner", "type":"address"}, {"name":"_operator", "type":"address"}], "name":"isApprovedForAll", "outputs":[{"name":"", "type":"bool"}], "payable":false, "stateMutability":"view", "type":"function"}, {"constant":false, "inputs":[{"name":"_newExec", "type":"address"}], "name":"setExec", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant":false, "inputs":[{"name":"_ipcId", "type":"uint256"}, {"name":"_xpId", "type":"uint256"}], "name":"grantXpToIpc", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"inputs":[], "payable":false, "stateMutability":"nonpayable", "type":"constructor"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"tokenId", "type":"uint256"}, {"indexed":true, "name":"developer", "type":"address"}, {"indexed":true, "name":"xpId", "type":"uint256"}], "name":"ExperienceEarned", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"_tokenId", "type":"uint256"}, {"indexed":false, "name":"_to", "type":"string"}], "name":"NameChanged", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"_tokenId", "type":"uint256"}, {"indexed":false, "name":"_seller", "type":"address"}, {"indexed":true, "name":"_buyer", "type":"address"}, {"indexed":false, "name":"price", "type":"uint256"}], "name":"Bought", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"_tokenId", "type":"uint256"}, {"indexed":false, "name":"from", "type":"uint256"}, {"indexed":false, "name":"to", "type":"uint256"}], "name":"PriceChanged", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":false, "name":"tokenId", "type":"uint256"}, {"indexed":true, "name":"owner", "type":"address"}, {"indexed":false, "name":"name", "type":"string"}], "name":"Created", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":false, "name":"tokenId", "type":"uint256"}, {"indexed":false, "name":"dna", "type":"bytes32"}, {"indexed":false, "name":"attributes", "type":"bytes32"}], "name":"Substantiated", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"tokenId", "type":"uint256"}, {"indexed":false, "name":"to", "type":"bytes32"}], "name":"DnaModified", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"_from", "type":"address"}, {"indexed":true, "name":"_to", "type":"address"}, {"indexed":true, "name":"_tokenId", "type":"uint256"}], "name":"Transfer", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"_owner", "type":"address"}, {"indexed":true, "name":"_approved", "type":"address"}, {"indexed":true, "name":"_tokenId", "type":"uint256"}], "name":"Approval", "type":"event"}, {"anonymous":false, "inputs":[{"indexed":true, "name":"_owner", "type":"address"}, {"indexed":true, "name":"_operator", "type":"address"}, {"indexed":false, "name":"_approved", "type":"bool"}], "name":"ApprovalForAll", "type":"event"}];

const IPCHELPERADDRESS = "0x1d8408DdE3296732389d52C256bA67120ef76d05";
const IPCHELPERABI = [{"inputs":[],"name":"IPCADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"getBulkIpc","outputs":[{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"bytes32[]","name":"attributeSeeds","type":"bytes32[]"},{"internalType":"bytes32[]","name":"dnas","type":"bytes32[]"},{"internalType":"uint128[]","name":"experiences","type":"uint128[]"},{"internalType":"uint128[]","name":"timeOfBirths","type":"uint128[]"}],"stateMutability":"view","type":"function"}];


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
