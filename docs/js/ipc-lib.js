function rgba(r, g, b, a)
{
    return { red: r, green: g, blue: b, alpha: a };
}

function hexstring_get_byte(string, index)
{
    if ((typeof string == "string") == false && (string instanceof String) == false)
        return -1000;

    string = string.toLowerCase();
    if (string.search(/^[xa-f0-9]+$/) == -1)
        return -1001;

    if (string.search(/0x/) != -1)
        index++;
    index*= 2;

    let hnibble = string.charAt(index);
    let lnibble = string.charAt(index + 1);

    let byte = parseInt("0x" + hnibble + lnibble, 16);

    return byte;
}

// Library Constants
const IPCColor = {
    White: 0,
    BlueGrey: 1,
    MidnightBlue: 2,
    Blue: 3,
    DarkBlue: 4,
    BlueBlack: 5,
    Icy: 6,
    Pale: 7,
    Beige: 8,
    Golden: 9,
    Tan: 10,
    LightBrown: 11,
    Brown: 12,
    DarkBrown: 13,
    Obsidian: 14,
    Red: 15,
    Grey: 16,
    Black: 17,
    Ice: 18,
    Green: 19,
    ForestGreen: 20,
    DarkBlueGreen: 21,
    BlueGreen: 22,
    PaleGreen: 23,
    Purple: 24,
    Orange: 25,
    Gold: 26,
    Amber: 27,
    DarkGrey: 28,
    LightYellow: 29,
    Yellow: 30,
    DarkYellow: 31,
    Platinum: 32,
    Blonde: 33,
    Auburn: 34,
    DarkRed: 35,
    MarbledWhite: 36,
    MarbledBlack: 37
};

const IPCRGBA = [
    rgba(1, 1, 1, 1), // White
    rgba(0.85882354, 0.8745098, 1, 1), // BlueGrey
    rgba(0.23921569, 0.28235295, 0.7372549, 1), // MidnightBlue
    rgba(0.31764707, 0.3764706, 1, 1), // Blue
    rgba(0.03529412, 0.07450981, 0.43137255, 1), // DarkBlue
    rgba(0.16078432, 0.18431373, 0.36862746, 1), // BlueBlack
    rgba(0.40392157, 0.7372549, 1, 1), // Icy
    rgba(0.98823535, 0.91372555, 0.8588236, 1), // Pale
    rgba(0.8862746, 0.7960785, 0.6627451, 1), // Beige
    rgba(1, 0.89411765, 0.14509805, 1), // Golden
    rgba(0.8235294, 0.7058824, 0.54901963, 1), // Tan
    rgba(0.8117647, 0.5372549, 0.10980392, 1), // LightBrown
    rgba(0.60784316, 0.3019608, 0, 1), // Brown
    rgba(0.3529412, 0.1764706, 0, 1), // DarkBrown
    rgba(0.23529412, 0.23529412, 0.23529412, 1), // Obsidian
    rgba(0.78039217, 0.26666668, 0.26666668, 1), // Red
    rgba(0.4392157, 0.4392157, 0.4392157, 1), // Grey
    rgba(0.15294118, 0.15294118, 0.15294118, 1), // Black
    rgba(0.51600003, 0.7866578, 1, 1), // Ice
    rgba(0.34013557, 0.66176474, 0.11678201, 1), // Green
    rgba(0.043137256, 0.4, 0.13725491, 1), // ForestGreen
    rgba(0.13725491, 0.32156864, 0.3019608, 1), // // DarkBlueGreen
    rgba(0.24313726, 0.5686275, 0.53333336, 1), // BlueGreen
    rgba(0.59607846, 0.9843137, 0.59607846, 1), // PaleGreen
    rgba(0.5686275, 0.27058825, 1, 1), // Purple
    rgba(0.9372549, 0.46666667, 0, 1), // Orange
    rgba(1, 0.89411765, 0.14509805, 1), // Gold
    rgba(0.6901961, 0.2509804, 0.011764706, 1), // Amber
    rgba(0.27058825, 0.27058825, 0.27058825, 1), // DarkGrey
    rgba(1, 0.9764706, 0, 1), // LightYellow
    rgba(0.7176471, 0.7019608, 0, 1), // Yellow
    rgba(0.5176471, 0.5058824, 0, 1), // DarkYellow
    rgba(0.875, 0.95575, 1, 1), // Platinum
    rgba(1, 0.9137255, 0.41960785, 1), // Blonde
    rgba(0.7058823, 0.19905882, 0, 1), // Auburn
    rgba(0.42352942, 0, 0, 1), // DarkRed
    rgba(0.8088235, 0.8088235, 0.8088235, 1), // MarbleWhite
    rgba(0.22794116, 0.22794116, 0.22794116, 1) // MarbleBlack
];

const IPCPercentOccurByRace = [ 0, 23, 31, 23, 23, 5 ];
const IPCPercentOccurByElfSubrace = [ 0, 20, 30, 30, 15, 5 ];
const IPCPercentOccurByHumanSubrace = [ 0, 10, 30, 16, 30, 15 ];
const IPCPercentOccurByDwarfSubrace = [ 0, 15, 50, 15, 15, 5 ];
const IPCPercentOccurByOrcSubrace = [ 0, 15, 15, 50, 15, 5 ];
const IPCLeftHandPercentByRace = [ 0, 15, 15, 10, 15, 5 ];
const IPCMalePercentByRace = [ 0, 50, 55, 75, 75, 5 ];
const IPCBaseHeightByRace = [ 0, 71, 60, 46, 70, 5 ];

const IPCMap = {
  race: {
    0: "Unknown",
    1: "Elf",
    2: "Human",
    3: "Dwarf",
    4: "Orc",
  },
  subrace: {
    0: "Unknown Elf",
    1: "Night Elf",
    2: "Wood Elf",
    3: "High Elf",
    4: "Sun Elf",
    5: "Dark Elf",

    6: "Unknown Human",
    7: "Mythical Human",
    8: "Nordic Human",
    9: "Eastern Human",
    10: "Coastal Human",
    11: "Southern Human",

    12: "Unknown Dwarf",
    13: "Quarry Dwarf",
    14: "Mountain Dwarf",
    15: "Lumber Dwarf",
    16: "Hill Dwarf",
    17: "Volcano Dwarf",

    18: "Unknown Orc",
    19: "Ash Orc",
    20: "Sand Orc",
    21: "Plains Orc",
    22: "Swamp Orc",
    23: "Blood Orc",
  },
  gender: {
    0: "Unknown",
    1: "Female",
    2: "Male",
    3: "Non-Binary",
  },
};

// Race
const IPC_UNKNOWN_RACE = 0;
const IPC_ELF = 1;
const IPC_HUMAN = 2;
const IPC_DWARF = 3;
const IPC_ORC = 4;

// Gender
const IPC_UNKNOWN_GENDER = 0;
const IPC_FEMALE = 1;
const IPC_MALE = 2;
const IPC_NONBINARY = 3; // Not a default option; Set by owner.

// Handedness
const IPC_UNKNOWN_HANDED = 0;
const IPC_LEFT_HANDED = 1;
const IPC_RIGHT_HANDED = 2;
const IPC_AMBIDEXTROUS = 3;

// Subrace
const IPC_UNKNOWN_ELF = 0;
const IPC_NIGHT_ELF = 1;
const IPC_WOOD_ELF = 2;
const IPC_HIGH_ELF = 3;
const IPC_SUN_ELF = 4;
const IPC_DARK_ELF = 5;

const IPC_UNKNOWN_HUMAN = 6;
const IPC_MYTHICAL_HUMAN = 7;
const IPC_NORDIC_HUMAN = 8;
const IPC_EASTERN_HUMAN = 9;
const IPC_COASTAL_HUMAN = 10;
const IPC_SOUTHERN_HUMAN = 11;

const IPC_UNKNOWN_DWARF = 12;
const IPC_QUARRY_DWARF = 13;
const IPC_MOUNTAIN_DWARF = 14;
const IPC_LUMBER_DWARF = 15;
const IPC_HILL_DWARF = 16;
const IPC_VOLCANO_DWARF = 17;

const IPC_UNKNOWN_ORC = 18;
const IPC_ASH_ORC = 19;
const IPC_SAND_ORC = 20;
const IPC_PLAINS_ORC = 21;
const IPC_SWAMP_ORC = 22;
const IPC_BLOOD_ORC = 23;

// Elf Subraces
const IPCNightElf = {
    SkinColor: [
    IPCColor.White,
    IPCColor.BlueGrey,
    IPCColor.MidnightBlue ],

    HairColor: [
    IPCColor.Blue,
    IPCColor.DarkBlue,
    IPCColor.MidnightBlue ],

    EyeColor: [
    IPCColor.Ice,
    IPCColor.Green,
    IPCColor.Blue,
    IPCColor.Purple ]
};

const IPCWoodElf = {
    SkinColor: [
    IPCColor.Pale,
    IPCColor.Beige,
    IPCColor.Golden ],

    HairColor: [
    IPCColor.LightBrown,
    IPCColor.Brown,
    IPCColor.Red ],

    EyeColor: [
    IPCColor.Blue,
    IPCColor.Green,
    IPCColor.Orange ]
};

const IPCHighElf = {
    SkinColor: [
    IPCColor.Pale,
    IPCColor.Beige,
    IPCColor.Tan ],

    HairColor: [
    IPCColor.Grey,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Green,
    IPCColor.Orange,
    IPCColor.Purple ]
};

const IPCSunElf = {
    SkinColor: [
    IPCColor.Tan,
    IPCColor.LightBrown,
    IPCColor.Brown ],

    HairColor: [
    IPCColor.Gold,
    IPCColor.Red,
    IPCColor.Brown ],

    EyeColor: [
    IPCColor.Blue,
    IPCColor.Green,
    IPCColor.Orange,
    IPCColor.Gold ]
};

const IPCDarkElf = {
    SkinColor: [
    IPCColor.Obsidian ],

    HairColor: [
    IPCColor.White ],

    EyeColor: [
    IPCColor.Red ]
};

// Human Sub Races
const IPCNordicHuman = {
    SkinColor: [
    IPCColor.Pale,
    IPCColor.Beige ],

    HairColor: [
    IPCColor.Platinum,
    IPCColor.Blonde,
    IPCColor.LightBrown,
    IPCColor.Red ],

    EyeColor: [
    IPCColor.Icy,
    IPCColor.Blue,
    IPCColor.Green ]
};

const IPCEasternHuman = {
    SkinColor: [
    IPCColor.Pale,
    IPCColor.Beige,
    IPCColor.Tan ],

    HairColor: [
    IPCColor.White,
    IPCColor.Grey,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Amber,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCCoastalHuman = {
    SkinColor: [
    IPCColor.Beige,
    IPCColor.Tan,
    IPCColor.Brown ],

    HairColor: [
    IPCColor.Blonde,
    IPCColor.Red,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Blue,
    IPCColor.Green,
    IPCColor.Brown ]
};

const IPCSouthernHuman = {
    SkinColor: [
    IPCColor.LightBrown,
    IPCColor.DarkBrown,
    IPCColor.Black ],

    HairColor: [
    IPCColor.White,
    IPCColor.Grey,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Green,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCMythicalHuman = {
    SkinColor: [
    IPCColor.White ],

    HairColor: [
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Red ]
};

// Dwarf Subraces
const IPCQuarryDwarf = {
    SkinColor: [
    IPCColor.White,
    IPCColor.MarbledWhite,
    IPCColor.MarbledBlack ],

    HairColor: [
    IPCColor.Blonde,
    IPCColor.LightBrown,
    IPCColor.Brown ],

    EyeColor: [
    IPCColor.Amber,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCMountainDwarf = {
    SkinColor: [
    IPCColor.Pale,
    IPCColor.Beige,
    IPCColor.Tan ],

    HairColor: [
    IPCColor.Brown,
    IPCColor.DarkBrown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Blue,
    IPCColor.Green,
    IPCColor.Brown ]
};

const IPCLumberDwarf = {
    SkinColor: [
    IPCColor.Tan,
    IPCColor.LightBrown,
    IPCColor.Brown ],

    HairColor: [
    IPCColor.Blonde,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Green,
    IPCColor.Amber,
    IPCColor.Brown ]
};

const IPCHillDwarf = {
    SkinColor: [
    IPCColor.Grey,
    IPCColor.Brown,
    IPCColor.DarkBrown ],

    HairColor: [
    IPCColor.Brown,
    IPCColor.DarkBrown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Amber,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCVolcanoDwarf = {
    SkinColor: [
    IPCColor.Grey,
    IPCColor.DarkGrey,
    IPCColor.Black ],

    HairColor: [
    IPCColor.Blue,
    IPCColor.BlueBlack,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Grey,
    IPCColor.Black,
    IPCColor.Purple ]
};

// Orc Subraces
const IPCAshOrc = {
    SkinColor: [
    IPCColor.Black,
    IPCColor.Grey,
    IPCColor.White ],

    HairColor: [
    IPCColor.White,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Gold,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCSandOrc = {
    SkinColor: [
    IPCColor.Pale,
    IPCColor.Yellow,
    IPCColor.DarkYellow ],

    HairColor: [
    IPCColor.White,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Gold,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCPlainsOrc = {
    SkinColor: [
    IPCColor.PaleGreen,
    IPCColor.Green,
    IPCColor.ForestGreen ],

    HairColor: [
    IPCColor.Red,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Gold,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCSwampOrc = {
    SkinColor: [
    IPCColor.ForestGreen,
    IPCColor.BlueGreen,
    IPCColor.DarkBlueGreen ],

    HairColor: [
    IPCColor.Auburn,
    IPCColor.DarkBrown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.Gold,
    IPCColor.Brown,
    IPCColor.Black ]
};

const IPCBloodOrc = {
    SkinColor: [
    IPCColor.Red,
    IPCColor.DarkRed ],

    HairColor: [
    IPCColor.White,
    IPCColor.Brown,
    IPCColor.Black ],

    EyeColor: [
    IPCColor.LightYellow,
    IPCColor.Yellow,
    IPCColor.Amber ]
};

// Library Private Functions
function _calculate_percent(byte_value)
{
    return parseInt(byte_value*100/255);
}

function _calculate_race(race_value)
{
    let race_percent = _calculate_percent(race_value);

    let index = 0, counter = 0;
    for (index = 0; index < IPCLib.IPCPercentOccurByRace.length; index++)
    {
        counter+= IPCLib.IPCPercentOccurByRace[index];
        if (race_percent < counter)
        {
            index = index % IPCLib.IPC_ORC;
            if (index == 0) return IPCLib.IPC_ORC;
            return index;
        }
    }

    return IPCLib.IPC_ORC;
}

function _get_percent_occur_by_subrace(race)
{
    switch (race)
    {
        case IPCLib.IPC_ELF: return IPCLib.IPCPercentOccurByElfSubrace;
        case IPCLib.IPC_HUMAN: return IPCLib.IPCPercentOccurByHumanSubrace;
        case IPCLib.IPC_DWARF: return IPCLib.IPCPercentOccurByDwarfSubrace;
        case IPCLib.IPC_ORC: return IPCLib.IPCPercentOccurByOrcSubrace;
    }

    return IPCLib.IPCPercentOccurByOrcSubrace;
}

function _calculate_subrace(race, subrace_value)
{
    const IPCPercentOccurBySubrace = _get_percent_occur_by_subrace(race);
    let subrace_percent = _calculate_percent(subrace_value);

    let index = 0, counter = 0;
    for (index = 1; index < 7; ++index)
    {
        counter+= IPCPercentOccurBySubrace[index];
        if (subrace_percent < (counter + 1)) break;
    }

    let start_index = ipc_get_subrace_list(race);

    if (index >= IPCPercentOccurBySubrace.length)
        return start_index + IPCPercentOccurBySubrace.length - 1;

    return start_index + index;
}

function _calculate_gender(race, gender_value)
{
    let gender_percent = _calculate_percent(gender_value);
    let is_male = gender_percent > (99 - IPCLib.IPCMalePercentByRace[race]);
    return is_male ? IPCLib.IPC_MALE : IPCLib.IPC_FEMALE;
}

function _calculate_elf_height(gender, height_percent)
{
    let height = IPCLib.IPCBaseHeightByRace[IPCLib.IPC_ELF]; // Default.
    if (gender == IPCLib.IPC_MALE) { height += 2; } // Elf Males are 2 inches taller.

    if (height_percent < 5) { return height; }
    else if (height_percent < 35) { return height + 1; }
    else if (height_percent < 60) { return height + 2; }
    else if (height_percent < 95) { return height + 3; }
    else { return height + 4; }
}

function _calculate_human_height(gender, height_percent)
{
    let height = IPCLib.IPCBaseHeightByRace[IPCLib.IPC_HUMAN]; // Default.
    if (gender == IPCLib.IPC_MALE) { height += 4; } // Human Males are 4 inches taller.

    if (height_percent < 5) { return height; }
    else if (height_percent < 10) { return height + 1; }
    else if (height_percent < 15) { return height + 2; }
    else if (height_percent < 25) { return height + 3; }
    else if (height_percent < 40) { return height + 4; }
    else if (height_percent < 55) { return height + 5; }
    else if (height_percent < 65) { return height + 6; }
    else if (height_percent < 75) { return height + 7; }
    else if (height_percent < 85) { return height + 8; }
    else if (height_percent < 90) { return height + 9; }
    else if (height_percent < 95) { return height + 10; }
    else { return height + 11; }
}

function _calculate_dwarf_height(gender, height_percent)
{
    let height = IPCLib.IPCBaseHeightByRace[IPCLib.IPC_DWARF]; // Default.
    if (gender == IPCLib.IPC_MALE) { height += 2; } // Dwarf males are 2 inches taller.

    if (height_percent < 5) { return height; }
    else if (height_percent < 15) { return height + 1; }
    else if (height_percent < 40) { return height + 2; }
    else if (height_percent < 65) { return height + 3; }
    else if (height_percent < 85) { return height + 4; }
    else if (height_percent < 95) { return height + 5; }
    else { return height + 6; }
}

function _calculate_orc_height(gender, height_percent)
{
    let height = IPCLib.IPCBaseHeightByRace[IPCLib.IPC_ORC]; // Default.
    if (gender == IPCLib.IPC_MALE) { height += 4; } // Orc males are 4 inches taller.

    if (height_percent < 5) { return height; }
    else if (height_percent < 10) { return height + 1; }
    else if (height_percent < 15) { return height + 2; }
    else if (height_percent < 25) { return height + 3; }
    else if (height_percent < 40) { return height + 4; }
    else if (height_percent < 55) { return height + 5; }
    else if (height_percent < 65) { return height + 6; }
    else if (height_percent < 75) { return height + 7; }
    else if (height_percent < 85) { return height + 8; }
    else if (height_percent < 90) { return height + 9; }
    else if (height_percent < 95) { return height + 10; }
    else { return height + 11; }
}

function _calculate_height(race, gender, height_value)
{
    let height_percent = _calculate_percent(height_value);

    switch (race)
    {
        case IPCLib.IPC_ELF: return _calculate_elf_height(gender, height_percent);
        case IPCLib.IPC_HUMAN: return _calculate_human_height(gender, height_percent);
        case IPCLib.IPC_DWARF: return _calculate_dwarf_height(gender, height_percent);
    }

    return _calculate_orc_height(gender, height_percent);
}

function _calculate_handed(race, handed_value)
{
    let handed_percent = _calculate_percent(handed_value);
    let is_left_handed = (handed_percent < IPCLib.IPCLeftHandPercentByRace[race]);
    return is_left_handed ? IPCLib.IPC_LEFT_HANDED : IPCLib.IPC_RIGHT_HANDED;
}

function _calculate_colors(dna_bytes)
{
    let properties = ipc_get_subrace_properties(dna_bytes[1]);
    if (properties == null) return;

    dna_bytes[5] = dna_bytes[5] * properties.SkinColor.length/256;
    dna_bytes[6] = dna_bytes[6] * properties.HairColor.length/256;
    dna_bytes[7] = dna_bytes[7] * properties.EyeColor.length/256;

    dna_bytes[5] = parseInt(dna_bytes[5]);
    dna_bytes[6] = parseInt(dna_bytes[6]);
    dna_bytes[7] = parseInt(dna_bytes[7]);

    dna_bytes[5] = properties.SkinColor[dna_bytes[5]];
    dna_bytes[6] = properties.HairColor[dna_bytes[6]];
    dna_bytes[7] = properties.EyeColor[dna_bytes[7]];
}

// Library Types

function t_label_ipc()
{
    this.id = 0;
    this.token_id = 0;
    this.name = "";

    this.attribute_seed = "";
    this.dna = "";
    this.birth = "";

    this.price = "";
    this.gold = "";
    this.xp = 0;
    this.owner = "";

    this.race = "";
    this.subrace = "";
    this.gender = "";
    this.height = "";

    this.eye_color = "";
    this.hair_color = "";
    this.skin_color = "";
    this.handedness = "";

    this.strength = 0;
    this.force = 0;
    this.sustain = 0;
    this.tolerance = 0;

    this.dexterity = 0;
    this.speed = 0;
    this.precision = 0;
    this.reaction = 0;

    this.intelligence = 0;
    this.memory = 0;
    this.processing = 0;
    this.reasoning = 0;

    this.constitution = 0;
    this.healing = 0;
    this.fortitude = 0;
    this.vitality = 0;

    this.luck = 0;
    this.accessories = "";
    this.last_updated = "";

    this.meta = {
        sprite: "",
        card: "",
        canon: "",
        rumor: ""
    };
}

function t_ipc()
{
    this.id = 0;
    this.token_id = 0;
    this.name = "";

    this.attribute_seed = "";
    this.dna = "";
    this.birth = 0;

    this.price = 0;
    this.gold = 0;
    this.xp = 0;
    this.owner = ""

    this.race = 0;
    this.subrace = 0;
    this.gender = 0;
    this.height = 0;

    this.eye_color = 0;
    this.hair_color = 0;
    this.skin_color = 0;
    this.handedness = 0;

    this.strength = 0;
    this.force = 0;
    this.sustain = 0;
    this.tolerance = 0;

    this.dexterity = 0;
    this.speed = 0;
    this.precision = 0;
    this.reaction = 0;

    this.intelligence = 0;
    this.memory = 0;
    this.processing = 0;
    this.reasoning = 0;

    this.constitution = 0;
    this.healing = 0;
    this.fortitude = 0;
    this.vitality = 0;

    this.luck = 0;
    this.accessories = 0;
    this.last_updated = 0;

    this.meta = {
        sprite: "",
        card: "",
        canon: "",
        rumor: ""
    };
}

// Library Functions
function ipc_timestamp()
{
    let timestamp = Date.now();
    timestamp = parseInt(timestamp/1000);

    return timestamp;
}

function ipc_format_month(month)
{
    switch (month)
    {
        case 0: return "Jan";
        case 1: return "Feb";
        case 2: return "Mar";
        case 3: return "Apr";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "Aug";
        case 8: return "Sep";
        case 9: return "Oct";
        case 10: return "Nov";
        default: return "Dec";
    }
}

function ipc_format_date(epoch)
{
    let date = new Date(0);
    date.setUTCSeconds(epoch);

    let time = "";

    time+= ipc_format_month(date.getMonth()) + " ";
    time+= date.getDate() + ", ";

    time+= date.getFullYear() + " ";

    let hours = date.getHours();
    if (hours == 0)
        time+= "12:";
    else time+= (hours % 13 + 1) + ":";

    let minutes = date.getMinutes();
    if (minutes < 10)
        time+= "0" + minutes;
    else time+= minutes;

    if (hours < 12) time+= "AM"
        else time+= "PM"

    return time;
}

// HACK
function ipc_format_price(price)
{
    price = price/100;
    price = price.toFixed(2);
    price = price.toString();

    if (price >= 1000000)
        price = price.slice(0, 1) + "," +
        price.slice(1,4) + "," +
        price.slice(4);
    else if (price >= 100000)
        price = price.slice(0, 3) + "," + price.slice(3);
    else if (price >= 10000)
        price = price.slice(0, 2) + "," + price.slice(2);

    return "$" + price;
}

function ipc_get_subrace_list(race)
{
    switch (race)
    {
        case IPCLib.IPC_ELF: return IPCLib.IPC_UNKNOWN_ELF;
        case IPCLib.IPC_HUMAN: return IPCLib.IPC_UNKNOWN_HUMAN;
        case IPCLib.IPC_DWARF: return IPCLib.IPC_UNKNOWN_DWARF;
        case IPCLib.IPC_ORC: return IPCLib.IPC_UNKNOWN_ORC;
    }

    return IPCLib.IPC_UNKNOWN_ORC;
}

function ipc_get_subrace_properties(subrace)
{
    let properties = null;

    switch (subrace)
    {
        case IPCLib.IPC_NIGHT_ELF: properties = IPCLib.IPCNightElf; break;
        case IPCLib.IPC_WOOD_ELF: properties = IPCLib.IPCWoodElf; break;
        case IPCLib.IPC_HIGH_ELF: properties = IPCLib.IPCHighElf; break;
        case IPCLib.IPC_SUN_ELF: properties = IPCLib.IPCSunElf; break;
        case IPCLib.IPC_DARK_ELF: properties = IPCLib.IPCDarkElf; break;

        case IPCLib.IPC_MYTHICAL_HUMAN: properties = IPCLib.IPCMythicalHuman; break;
        case IPCLib.IPC_NORDIC_HUMAN: properties = IPCLib.IPCNordicHuman; break;
        case IPCLib.IPC_EASTERN_HUMAN: properties = IPCLib.IPCEasternHuman; break;
        case IPCLib.IPC_COASTAL_HUMAN: properties = IPCLib.IPCCoastalHuman; break;
        case IPCLib.IPC_SOUTHERN_HUMAN: properties = IPCLib.IPCSouthernHuman; break;

        case IPCLib.IPC_QUARRY_DWARF: properties = IPCLib.IPCQuarryDwarf; break;
        case IPCLib.IPC_MOUNTAIN_DWARF: properties = IPCLib.IPCMountainDwarf; break;
        case IPCLib.IPC_LUMBER_DWARF: properties = IPCLib.IPCLumberDwarf; break;
        case IPCLib.IPC_HILL_DWARF: properties = IPCLib.IPCHillDwarf; break;
        case IPCLib.IPC_VOLCANO_DWARF: properties = IPCLib.IPCVolcanoDwarf; break;

        case IPCLib.IPC_ASH_ORC: properties = IPCLib.IPCAshOrc; break;
        case IPCLib.IPC_SAND_ORC: properties = IPCLib.IPCSandOrc; break;
        case IPCLib.IPC_PLAINS_ORC: properties = IPCLib.IPCPlainsOrc; break;
        case IPCLib.IPC_SWAMP_ORC: properties = IPCLib.IPCSwampOrc; break;
        case IPCLib.IPC_BLOOD_ORC: properties = IPCLib.IPCBloodOrc; break;
    }

    return properties;
}

function ipc_calculate_attributes(attribute_seed)
{
    console.log("ipc_calculate_attributes - attribute_seed: " + attribute_seed);
    let attribute_bytes = new Array();

    // Convert hex string to individual bytes.
    let index = 0;
    for (index = 0; index < 12; index++)
        attribute_bytes[index] = hexstring_get_byte(attribute_seed, index);

    // Convert bytes to dice rolls.
    for (index = 0; index < 12; index++)
    {
        attribute_bytes[index] = (attribute_bytes[index] * 6) / 256 + 1;
        attribute_bytes[index] = parseInt(attribute_bytes[index]);
    }

    // Calculate luck.
    let luck = 0;
    for (index = 0; index < 12; index++)
        luck+= attribute_bytes[index];

    luck/= 4;
    luck = parseInt(luck);

    attribute_bytes[12] = 21 - luck;

    return attribute_bytes;
}

function ipc_calculate_dna(dna_seed)
{
    let dna_bytes = new Array();

    let index = 0;
    for (index = 0; index < 8; index++)
        dna_bytes[index] = hexstring_get_byte(dna_seed, index);

    dna_bytes[0] = _calculate_race(dna_bytes[0]);
    dna_bytes[1] = _calculate_subrace(dna_bytes[0], dna_bytes[1]);
    dna_bytes[2] = _calculate_gender(dna_bytes[0], dna_bytes[2]);

    dna_bytes[3] = _calculate_height(dna_bytes[0], dna_bytes[2], dna_bytes[3]);
    dna_bytes[4] = _calculate_handed(dna_bytes[0], dna_bytes[4]);

    _calculate_colors(dna_bytes)

    return dna_bytes;
}

function ipc_create_label_ipc(ipc, IPCLang)
{
    let label_ipc = new t_label_ipc();

    label_ipc.token_id = ipc.token_id;
    label_ipc.name = ipc.name;
    // label_ipc.meta.sprite = ipc.meta.sprite;

    label_ipc.attribute_seed = ipc.attribute_seed;
    label_ipc.dna = ipc.dna;
    label_ipc.birth = ipc_format_date(ipc.birth);

    label_ipc.price = ipc_format_price(ipc.price);
    label_ipc.gold = ipc.gold;
    label_ipc.xp = ipc.xp;
    label_ipc.owner = ipc.owner;

    label_ipc.race = IPCLang.Race[ipc.race];
    label_ipc.subrace = IPCLang.Subrace[ipc.subrace];
    label_ipc.gender = IPCLang.Gender[ipc.gender];
    label_ipc.height = parseInt(ipc.height/12) + "'" + (ipc.height % 12) + "\"";

    label_ipc.skin_color = IPCLang.Color[ipc.skin_color];
    label_ipc.hair_color = IPCLang.Color[ipc.hair_color];
    label_ipc.eye_color = IPCLang.Color[ipc.eye_color];
    label_ipc.handedness = IPCLang.Handedness[ipc.handedness];

    label_ipc.strength = ipc.strength;
    label_ipc.force = ipc.force;
    label_ipc.sustain = ipc.sustain;
    label_ipc.tolerance = ipc.tolerance;

    label_ipc.dexterity = ipc.dexterity;
    label_ipc.speed = ipc.speed;
    label_ipc.precision = ipc.precision;
    label_ipc.reaction = ipc.reaction;

    label_ipc.intelligence = ipc.intelligence;
    label_ipc.memory = ipc.memory;
    label_ipc.processing = ipc.processing;
    label_ipc.reasoning = ipc.reasoning;

    label_ipc.constitution = ipc.constitution;
    label_ipc.healing = ipc.healing;
    label_ipc.fortitude = ipc.fortitude;
    label_ipc.vitality = ipc.vitality;

    label_ipc.luck = ipc.luck;
    label_ipc.accessories = ipc.accessories
    label_ipc.last_updated = ipc_format_date(ipc.last_updated);

    if (label_ipc.name == "")
    {
        label_ipc.name = label_ipc.gender +
            " " + label_ipc.race +
            " " + label_ipc.token_id
    }

    // label_ipc.meta.sprite = ipc.meta.sprite;
    // label_ipc.meta.card = ipc.meta.card;
    // label_ipc.meta.canon = ipc.meta.canon;
    // label_ipc.meta.rumor = ipc.meta.rumor;

    return label_ipc;
}

function ipc_create_ipc_from_json(json_ipc)
{
    let dna_bytes = ipc_calculate_dna(json_ipc.dna);
    console.log("dna_bytes: " + dna_bytes);
    let attribute_bytes = ipc_calculate_attributes(json_ipc.attribute_seed);
    console.log("attribute_bytes: " + attribute_bytes);

    let ipc = new t_ipc();

    // ipc.id = json_ipc.id;
    ipc.token_id = json_ipc.token_id;
    ipc.name = json_ipc.name;
    // ipc.meta.sprite = json_ipc.meta.sprite;
    //
    ipc.attribute_seed = json_ipc.attribute_seed;
    ipc.dna = json_ipc.dna;
    ipc.birth = parseInt(json_ipc.birth);
    //
    // ipc.price = parseInt(json_ipc.price);
    // ipc.xp = parseInt(json_ipc.xp);
    ipc.owner = json_ipc.owner;
    //
    ipc.race = dna_bytes[0];
    ipc.subrace = dna_bytes[1];
    ipc.gender = dna_bytes[2];
    ipc.height = dna_bytes[3];
    //
    ipc.skin_color = dna_bytes[5];
    ipc.hair_color = dna_bytes[6];
    ipc.eye_color = dna_bytes[7];
    ipc.handedness = dna_bytes[4];
    //
    ipc.force = attribute_bytes[0];
    ipc.sustain = attribute_bytes[1];
    ipc.tolerance = attribute_bytes[2];
    ipc.strength = ipc.force + ipc.sustain + ipc.tolerance;
    //
    ipc.speed = attribute_bytes[3];
    ipc.precision = attribute_bytes[4];
    ipc.reaction = attribute_bytes[5];
    ipc.dexterity = ipc.speed + ipc.precision + ipc.reaction;
    //
    ipc.memory = attribute_bytes[6];
    ipc.processing = attribute_bytes[7];
    ipc.reasoning = attribute_bytes[8];
    ipc.intelligence = ipc.memory + ipc.processing + ipc.reasoning;
    //
    ipc.healing = attribute_bytes[9];
    ipc.fortitude = attribute_bytes[10];
    ipc.vitality = attribute_bytes[11];
    ipc.constitution = ipc.healing + ipc.fortitude + ipc.vitality;

    ipc.luck = attribute_bytes[12];
    //
    // ipc.accessories = json_ipc.accessories;
    // if (ipc.accessories == "")
    //     ipc.accessories = 0;
    // ipc.accessories = parseInt(ipc.accessories);
    //
    // ipc.last_updated = parseInt(json_ipc.last_updated);
    //
    // ipc.meta.sprite = json_ipc.meta.sprite;
    // ipc.meta.card = json_ipc.meta.card;
    // ipc.meta.canon = json_ipc.meta.canon;
    // ipc.meta.rumor = json_ipc.meta.rumor;

    return ipc;
}

const IPCLib =
{
    IPCColor: IPCColor,
    IPCRGBA: IPCRGBA,

    IPCPercentOccurByRace: IPCPercentOccurByRace,
    IPCPercentOccurByElfSubrace: IPCPercentOccurByElfSubrace,
    IPCPercentOccurByHumanSubrace: IPCPercentOccurByHumanSubrace,
    IPCPercentOccurByDwarfSubrace: IPCPercentOccurByDwarfSubrace,
    IPCPercentOccurByOrcSubrace: IPCPercentOccurByOrcSubrace,
    IPCLeftHandPercentByRace: IPCLeftHandPercentByRace,
    IPCMalePercentByRace: IPCMalePercentByRace,
    IPCBaseHeightByRace: IPCBaseHeightByRace,

    IPCMap: IPCMap,
    // Race
    IPC_UNKNOWN_RACE: IPC_UNKNOWN_RACE,
    IPC_ELF: IPC_ELF,
    IPC_HUMAN: IPC_HUMAN,
    IPC_DWARF: IPC_DWARF,
    IPC_ORC: IPC_ORC,

    // Gender
    IPC_UNKNOWN_GENDER: IPC_UNKNOWN_GENDER,
    IPC_FEMALE: IPC_FEMALE,
    IPC_MALE: IPC_MALE,
    IPC_NONBINARY: IPC_NONBINARY,

    // Handedness
    IPC_UNKNOWN_HANDED: IPC_UNKNOWN_HANDED,
    IPC_LEFT_HANDED: IPC_LEFT_HANDED,
    IPC_RIGHT_HANDED: IPC_RIGHT_HANDED,
    IPC_AMBIDEXTROUS: IPC_AMBIDEXTROUS,

    // Subrace
    IPC_UNKNOWN_ELF: IPC_UNKNOWN_ELF,
    IPC_NIGHT_ELF: IPC_NIGHT_ELF,
    IPC_WOOD_ELF: IPC_WOOD_ELF,
    IPC_HIGH_ELF: IPC_HIGH_ELF,
    IPC_SUN_ELF: IPC_SUN_ELF,
    IPC_DARK_ELF: IPC_DARK_ELF,

    IPC_UNKNOWN_HUMAN: IPC_UNKNOWN_HUMAN,
    IPC_MYTHICAL_HUMAN: IPC_MYTHICAL_HUMAN,
    IPC_NORDIC_HUMAN: IPC_NORDIC_HUMAN,
    IPC_EASTERN_HUMAN: IPC_EASTERN_HUMAN,
    IPC_COASTAL_HUMAN: IPC_COASTAL_HUMAN,
    IPC_SOUTHERN_HUMAN: IPC_SOUTHERN_HUMAN,

    IPC_UNKNOWN_DWARF: IPC_UNKNOWN_DWARF,
    IPC_QUARRY_DWARF: IPC_QUARRY_DWARF,
    IPC_MOUNTAIN_DWARF: IPC_MOUNTAIN_DWARF,
    IPC_LUMBER_DWARF: IPC_LUMBER_DWARF,
    IPC_HILL_DWARF: IPC_HILL_DWARF,
    IPC_VOLCANO_DWARF: IPC_VOLCANO_DWARF,

    IPC_UNKNOWN_ORC: IPC_UNKNOWN_ORC,
    IPC_ASH_ORC: IPC_ASH_ORC,
    IPC_SAND_ORC: IPC_SAND_ORC,
    IPC_PLAINS_ORC: IPC_PLAINS_ORC,
    IPC_SWAMP_ORC: IPC_SWAMP_ORC,
    IPC_BLOOD_ORC: IPC_BLOOD_ORC,

    // Elf Subraces
    IPCNightElf: IPCNightElf,
    IPCWoodElf: IPCWoodElf,
    IPCHighElf: IPCHighElf,
    IPCSunElf: IPCSunElf,
    IPCDarkElf: IPCDarkElf,

    // Human Sub Races
    IPCNordicHuman: IPCNordicHuman,
    IPCEasternHuman: IPCEasternHuman,
    IPCCoastalHuman: IPCCoastalHuman,
    IPCSouthernHuman: IPCSouthernHuman,
    IPCMythicalHuman: IPCMythicalHuman,

    // Dwarf Subraces
    IPCQuarryDwarf: IPCQuarryDwarf,
    IPCMountainDwarf: IPCMountainDwarf,
    IPCLumberDwarf: IPCLumberDwarf,
    IPCHillDwarf: IPCHillDwarf,
    IPCVolcanoDwarf: IPCVolcanoDwarf,

    // Orc Subraces
    IPCAshOrc: IPCAshOrc,
    IPCSandOrc: IPCSandOrc,
    IPCPlainsOrc: IPCPlainsOrc,
    IPCSwampOrc: IPCSwampOrc,
    IPCBloodOrc: IPCBloodOrc,

    // t_json_ipc: t_json_ipc,
    t_label_ipc: t_label_ipc,
    t_ipc: t_ipc,

    ipc_timestamp: ipc_timestamp,
    ipc_format_month: ipc_format_month,
    ipc_format_date: ipc_format_date,
    ipc_format_price: ipc_format_price,
    ipc_get_subrace_list: ipc_get_subrace_list,
    ipc_get_subrace_properties: ipc_get_subrace_properties,
    ipc_calculate_attributes: ipc_calculate_attributes,
    ipc_calculate_dna: ipc_calculate_dna,
    ipc_create_label_ipc: ipc_create_label_ipc,
    ipc_create_ipc_from_json: ipc_create_ipc_from_json
};

// if (typeof IPC_BROWSER === "undefined")
//     module.exports = IPCLib;
