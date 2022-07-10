const CONTRACTS = [
  {
    address: '0x4b1705c75fde41e35e454ddd14e5d0a0eac06280',
    name: 'Etheria v0.9 Wrapper',
    type: 'ERC721',
    notes: 'TODO: Images not working',
    wrapperOf: {
      address: '0xe468D26721b703D224d05563cB64746A7A40E1F4',
      name: 'Etheria v0.9',
      date: 'Oct-19-2015 02:54:36 PM +UTC',
      tx: '0xe937868a0a38fa866dfb7e64c0ca2291d1d1f8534f60057b67f3346368fa529c',
    }
  },
  {
    address: '0x629a493a94b611138d4bee231f94f5c08ab6570a',
    name: 'Etheria v1.0 Wrapper',
    type: 'ERC721',
    notes: 'TODO: Images not working',
    wrapperOf: {
      address: '0xe414716F017b5c1457bF98e985BCcB135DFf81F2',
      name: 'Etheria v1.0',
      date: 'Oct-22-2015 03:34:34 AM +UTC',
      tx: '0xfeeef4e929534cfa9da1a4fcefae2af223b2e64bc86d644559625b5bf88b40b5',
    }
  },
  {
    address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
    name: 'ENS',
    type: 'ERC721',
    notes: 'ENS 2020',
    upgradeOf: {
      address: '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
      name: 'ENS: Old Registrar',
      date: 'Apr-26-2017 07:14:49 PM +UTC',
      tx: '0x4c3fd67575a9254c553d906af0f2c84789502bae5a6723ea3bc345c5dcbf0751',
    }
  },

];


//   <b-dropdown-group header="2015 Vintage
//     '0x4b1705c75fde41e35e454ddd14e5d0a0eac06280' Oct 19 Etheria v0.9 (wrapped, image not working)</b-dropdown-item>
//     '0x629a493a94b611138d4bee231f94f5c08ab6570a' Oct 22 Etheria v1.0 (wrapped, image not working)</b-dropdown-item>
//     '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' Apr 26 ENS (new Jan 30 2020)</b-dropdown-item>
//   <b-dropdown-group header="2016 Vintage
//     '0x050dc61dFB867E0fE3Cf2948362b6c0F3fAF790b' Nov 17 PixelMap (wrapped)</b-dropdown-item>
//   <b-dropdown-group header="2017 Vintage
//     '0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d' Jun 09 CryptoPunks V1 (wrapped)</b-dropdown-item>
//     '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6' Jun 22 CryptoPunks V2 (wrapped)</b-dropdown-item>
//     '0xc3f733ca98e0dad0386979eb96fb1722a1a05e69' Aug 09 MoonCats (wrapped, official)</b-dropdown-item>
//     '0x7c40c393dc0f283f318791d746d894ddd3693572' Aug 09 Wrapped MoonCatsRescue - Unofficial (wrapped)</b-dropdown-item>
//     '0x7bb952ab78b28a62b1525aca54a71e7aa6177645' Aug 27 Thousand Ether Homepage (wrapped)</b-dropdown-item>
//     '0x80f1ed6a1ac694317dc5719db099a440627d1ea7' Aug 29 IKB Cachet de Garantie (wrapped)</b-dropdown-item>
//     '0x5F53f9f5DcF76757f7CbF35C2e47164C65b9b5eD' Oct 05 Wrapped Historic DADA (wrapped, dyor)</b-dropdown-item>
//     '0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392' Oct 05 Dada Collectible (wrapped, dyor)</b-dropdown-item>
//     '0xe81175546f554ca6ceb63b142f27de7557c5bf62' Oct 20 Lunar Moon Plots (wrapped)</b-dropdown-item>
//     '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d' Nov 23 CryptoKitties (large data set, not working)</b-dropdown-item>
//     '0xd0e7bc3f1efc5f098534bce73589835b8273b9a0' Dec 24 Wrapped CryptoCats Official</b-dropdown-item>
//     '0x8479277aacff4663aa4241085a7e27934a0b0840' Dec 30 Realms of Ether (wrapped)</b-dropdown-item>
//   <b-dropdown-group header="2018 Vintage
//     '0x79986af15539de2db9a5086382daeda917a9cf0c' Jan 22 CryptoFighters</b-dropdown-item>
//     '0x79986af15539de2db9a5086382daeda917a9cf0c' Jun 05 Voxels (originally CryptoVoxels, not working)</b-dropdown-item>
//     '0xbfde6246df72d3ca86419628cac46a9d2b60393c' Aug 02 Etheremon Adventure</b-dropdown-item>
//   <b-dropdown-group header="2019 Vintage
//     '0xd4e4078ca3495de5b1d4db434bebc5a986197782' Apr 05 Autoglyph</b-dropdown-item>
//   <b-dropdown-group header="2020 Vintage
//   <b-dropdown-group header="2021 Vintage
//     '0xc2c747e0f7004f9e8817db2ca4997657a7746928' Jan 28 Hashmasks</b-dropdown-item>
//     '0x31385d3520bced94f77aae104b406994d8f2168c' Mar 07 BASTARD GAN PUNKS V2</b-dropdown-item>
//     '0x97ca7fe0b0288f5eb85f386fed876618fb9b8ab8' Mar 17 Ether Cards Founder</b-dropdown-item>
//     '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' Apr 22 Bored Ape Yacht Club</b-dropdown-item>
//     '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7' May 03 Meebits</b-dropdown-item>
//     '0xba30e5f9bb24caa003e9f2f0497ad287fdf95623' Jun 18 Bored Ape Kennel Club</b-dropdown-item>
//     '0x1a92f7381b9f03921564a437210bb9396471050c' Jun 27 Cool Cats NFT</b-dropdown-item>
//     '0xbd3531da5cf5857e7cfaa92426877b022e612cf8' Jul 22 Pudgy Penguins</b-dropdown-item>
//     '0x42069abfe407c60cf4ae4112bedead391dba1cdb' Jul 28 CryptoDickButts</b-dropdown-item>
//     '0x60e4d786628fea6478f785a6d7e704777c86a7c6' Aug 28 Mutant Ape Yacht Club</b-dropdown-item>
//     '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6' Sep 08 CrypToadz</b-dropdown-item>
//     '0x1a2f71468f656e97c2f86541e57189f59951efe7' Oct 07 Cryptomories</b-dropdown-item>
//     '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e' Oct 16 Doodles</b-dropdown-item>
//     '0xe0fa9fb0e30ca86513642112bee1cbbaa2a0580d' Oct 18 The Greats by Wolfgang Beltracchi</b-dropdown-item>
//     '0x79fcdef22feed20eddacbb2587640e45491b757f' Nov 29 mfers</b-dropdown-item>
//   <b-dropdown-group header="2022
//     '0xed5af388653567af2f388e6224dc7c4b3241c544' Jan 10 Azuki</b-dropdown-item>
//     '0xf1bdfc38b0089097f050141d21f5e8a3cb0ec8fc' Jan 28 CryptoTitVags</b-dropdown-item>
//     '0x45bC849a53a3531648EE7E27dD09FCaa23Ca5ff9' Mar 25 PepeMfers Official</b-dropdown-item>
//     '0x23581767a106ae21c074b2276d25e5c3e136a68b' Apr 15 Moonbirds</b-dropdown-item>
//     '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258' Apr 28 Otherdeed for Otherside</b-dropdown-item>
