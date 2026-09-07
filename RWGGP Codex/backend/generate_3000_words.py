"""
Generate 3000 most common English words with Color Vowel Chart classifications
"""

# 3000 most common English words based on frequency
COMMON_WORDS_3000 = [
    # Top 100 most frequent
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    
    # 101-200
    "is", "was", "are", "been", "has", "had", "were", "said", "did", "having",
    "may", "should", "could", "might", "must", "shall", "can", "need", "dare", "ought",
    "very", "through", "between", "under", "never", "below", "might", "being", "both", "few",
    "far", "off", "quite", "rather", "too", "such", "those", "here", "where", "who",
    "each", "more", "much", "such", "own", "same", "still", "great", "little", "next",
    "old", "right", "big", "high", "different", "small", "large", "major", "best", "better",
    "able", "around", "before", "during", "early", "fast", "full", "hard", "late", "long",
    "open", "short", "strong", "young", "ago", "already", "enough", "far", "forward", "however",
    "instead", "later", "less", "maybe", "more", "near", "off", "once", "soon", "still",
    "today", "together", "tonight", "tomorrow", "yesterday", "within", "without", "yet", "across", "against",
    
    # 201-300
    "among", "beyond", "down", "except", "inside", "outside", "toward", "yes", "sure", "okay",
    "man", "woman", "child", "person", "family", "group", "friend", "mother", "father", "parent",
    "boy", "girl", "baby", "kid", "student", "teacher", "doctor", "nurse", "police", "officer",
    "hand", "eye", "face", "head", "body", "foot", "heart", "blood", "bone", "skin",
    "house", "home", "room", "door", "window", "wall", "floor", "roof", "table", "chair",
    "bed", "food", "water", "air", "fire", "tree", "plant", "animal", "dog", "cat",
    "bird", "fish", "book", "paper", "pen", "pencil", "picture", "photo", "music", "sound",
    "word", "name", "number", "letter", "line", "page", "place", "city", "town", "country",
    "state", "world", "earth", "land", "sea", "river", "mountain", "road", "street", "car",
    "bus", "train", "plane", "ship", "phone", "computer", "machine", "tool", "box", "bag",
    
    # 301-500
    "money", "dollar", "price", "cost", "buy", "sell", "pay", "spend", "save", "bank",
    "job", "work", "business", "company", "office", "worker", "boss", "manager", "president", "director",
    "market", "store", "shop", "mall", "product", "service", "customer", "client", "sale", "trade",
    "school", "class", "course", "lesson", "homework", "test", "exam", "grade", "degree", "college",
    "university", "education", "learn", "study", "teach", "read", "write", "speak", "listen", "understand",
    "question", "answer", "problem", "solution", "idea", "thought", "mind", "brain", "memory", "knowledge",
    "fact", "truth", "lie", "story", "history", "news", "information", "data", "report", "research",
    "science", "math", "art", "music", "sport", "game", "play", "player", "team", "win",
    "lose", "fight", "war", "peace", "law", "rule", "right", "wrong", "crime", "justice",
    "government", "politics", "election", "vote", "party", "leader", "public", "private", "social", "national",
    "local", "international", "global", "human", "nature", "natural", "physical", "mental", "health", "medical",
    "hospital", "patient", "disease", "pain", "sick", "healthy", "die", "dead", "death", "life",
    "live", "birth", "born", "grow", "age", "old", "young", "adult", "senior", "generation",
    "culture", "religion", "god", "church", "christian", "muslim", "jewish", "believe", "faith", "pray",
    "love", "like", "hate", "enjoy", "prefer", "want", "need", "wish", "hope", "dream",
    "feel", "feeling", "emotion", "happy", "sad", "angry", "afraid", "worried", "excited", "surprised",
    "interested", "bored", "tired", "hungry", "thirsty", "hot", "cold", "warm", "cool", "weather",
    "sun", "moon", "star", "sky", "cloud", "rain", "snow", "wind", "storm", "season",
    "spring", "summer", "fall", "winter", "morning", "afternoon", "evening", "night", "hour", "minute",
    "second", "week", "month", "century", "past", "present", "future", "history", "modern", "ancient",
    
    # 501-1000
    "beautiful", "pretty", "ugly", "clean", "dirty", "easy", "difficult", "hard", "simple", "complex",
    "important", "necessary", "possible", "impossible", "certain", "sure", "clear", "obvious", "strange", "unusual",
    "common", "rare", "special", "particular", "general", "specific", "exact", "correct", "wrong", "true",
    "false", "real", "actual", "virtual", "main", "central", "basic", "fundamental", "primary", "secondary",
    "positive", "negative", "good", "bad", "better", "worse", "best", "worst", "excellent", "terrible",
    "fine", "nice", "wonderful", "awful", "horrible", "pleasant", "unpleasant", "comfortable", "uncomfortable", "safe",
    "dangerous", "serious", "funny", "silly", "stupid", "smart", "intelligent", "wise", "foolish", "crazy",
    "normal", "regular", "ordinary", "extraordinary", "usual", "unusual", "typical", "average", "standard", "unique",
    "poor", "rich", "wealthy", "expensive", "cheap", "free", "valuable", "worthless", "useful", "useless",
    "ready", "busy", "available", "empty", "full", "complete", "whole", "entire", "total", "partial",
    "public", "private", "personal", "individual", "general", "particular", "professional", "amateur", "official", "unofficial",
    "formal", "informal", "casual", "serious", "final", "initial", "original", "copy", "real", "fake",
    "active", "passive", "direct", "indirect", "immediate", "delayed", "quick", "slow", "fast", "rapid",
    "sudden", "gradual", "permanent", "temporary", "constant", "variable", "stable", "unstable", "fixed", "flexible",
    "solid", "liquid", "gas", "hard", "soft", "rough", "smooth", "sharp", "dull", "thick",
    "thin", "wide", "narrow", "deep", "shallow", "tall", "short", "high", "low", "heavy",
    "light", "strong", "weak", "powerful", "powerless", "loud", "quiet", "silent", "noisy", "bright",
    "dark", "light", "shadow", "color", "red", "blue", "green", "yellow", "black", "white",
    "brown", "orange", "purple", "pink", "gray", "gold", "silver", "bright", "pale", "dark",
    "circle", "square", "triangle", "round", "flat", "straight", "curved", "bent", "twisted", "broken",
    "fixed", "damaged", "perfect", "imperfect", "complete", "incomplete", "finished", "unfinished", "ready", "prepared",
    "organized", "messy", "neat", "tidy", "clean", "dirty", "fresh", "stale", "new", "old",
    "modern", "ancient", "current", "past", "future", "recent", "latest", "previous", "next", "following",
    "left", "right", "middle", "center", "side", "edge", "corner", "top", "bottom", "front",
    "back", "inside", "outside", "upper", "lower", "inner", "outer", "forward", "backward", "upward",
    "downward", "north", "south", "east", "west", "nearby", "distant", "close", "far", "near",
    "approach", "reach", "arrive", "leave", "depart", "enter", "exit", "return", "visit", "travel",
    "trip", "journey", "tour", "vacation", "holiday", "rest", "relax", "sleep", "wake", "dream",
    "eat", "drink", "taste", "smell", "touch", "see", "hear", "watch", "look", "listen",
    "talk", "speak", "say", "tell", "ask", "answer", "explain", "describe", "discuss", "argue",
    "agree", "disagree", "accept", "refuse", "allow", "permit", "forbid", "prevent", "stop", "start",
    "begin", "finish", "end", "continue", "pause", "break", "rest", "wait", "stay", "remain",
    "change", "alter", "modify", "transform", "convert", "turn", "become", "grow", "develop", "improve",
    "increase", "decrease", "reduce", "raise", "lower", "rise", "fall", "drop", "lift", "carry",
    "hold", "grab", "catch", "throw", "push", "pull", "drag", "move", "shift", "transfer",
    "send", "receive", "give", "take", "bring", "fetch", "deliver", "supply", "provide", "offer",
    "accept", "reject", "choose", "select", "pick", "decide", "determine", "judge", "evaluate", "assess",
    "measure", "count", "calculate", "compute", "estimate", "guess", "predict", "expect", "anticipate", "hope",
    "wish", "desire", "want", "need", "require", "demand", "request", "ask", "beg", "plead",
    "suggest", "recommend", "advise", "warn", "threaten", "promise", "swear", "vow", "guarantee", "assure",
    "convince", "persuade", "influence", "affect", "impact", "cause", "create", "produce", "generate", "make",
    "build", "construct", "establish", "found", "form", "shape", "design", "plan", "organize", "arrange",
    "prepare", "cook", "bake", "boil", "fry", "grill", "roast", "serve", "order", "reserve",
    "book", "schedule", "plan", "arrange", "organize", "manage", "control", "direct", "lead", "guide",
    "follow", "track", "trace", "pursue", "chase", "hunt", "search", "seek", "find", "discover",
    "locate", "identify", "recognize", "distinguish", "separate", "divide", "split", "share", "distribute", "spread",
    "scatter", "gather", "collect", "accumulate", "save", "store", "keep", "preserve", "protect", "defend",
    "guard", "secure", "lock", "unlock", "open", "close", "shut", "seal", "cover", "uncover",
    "hide", "reveal", "show", "display", "exhibit", "present", "introduce", "announce", "declare", "state",
    "claim", "assert", "maintain", "insist", "argue", "debate", "fight", "struggle", "compete", "contest",
    "challenge", "oppose", "resist", "attack", "defend", "protect", "support", "help", "assist", "aid",
    "serve", "benefit", "advantage", "profit", "gain", "earn", "make", "acquire", "obtain", "get",
    "receive", "achieve", "accomplish", "succeed", "fail", "lose", "miss", "lack", "need", "require",
    
    # 1001-1500
    "include", "contain", "consist", "comprise", "involve", "concern", "relate", "connect", "link", "associate",
    "combine", "join", "unite", "merge", "mix", "blend", "separate", "divide", "split", "break",
    "crack", "tear", "rip", "cut", "slice", "chop", "carve", "shape", "form", "mold",
    "press", "squeeze", "crush", "grind", "pound", "beat", "hit", "strike", "knock", "tap",
    "touch", "feel", "stroke", "rub", "scratch", "scrape", "wipe", "clean", "wash", "rinse",
    "dry", "wet", "soak", "dip", "pour", "spill", "leak", "drip", "flow", "stream",
    "run", "walk", "jog", "sprint", "race", "jump", "leap", "hop", "skip", "climb",
    "crawl", "creep", "slide", "slip", "skid", "roll", "spin", "turn", "twist", "bend",
    "stretch", "extend", "expand", "contract", "shrink", "compress", "squeeze", "inflate", "deflate", "burst",
    "explode", "blast", "bang", "boom", "crash", "smash", "shatter", "destroy", "ruin", "damage",
    "harm", "hurt", "injure", "wound", "kill", "murder", "slaughter", "execute", "die", "perish",
    "survive", "live", "exist", "breathe", "inhale", "exhale", "cough", "sneeze", "yawn", "sigh",
    "laugh", "giggle", "chuckle", "smile", "grin", "frown", "scowl", "cry", "weep", "sob",
    "shout", "yell", "scream", "shriek", "whisper", "murmur", "mumble", "mutter", "groan", "moan",
    "sing", "hum", "whistle", "dance", "perform", "act", "pretend", "fake", "imitate", "copy",
    "repeat", "rehearse", "practice", "train", "exercise", "drill", "coach", "teach", "instruct", "educate",
    "inform", "notify", "alert", "warn", "remind", "remember", "recall", "recollect", "forget", "ignore",
    "neglect", "overlook", "miss", "notice", "observe", "watch", "monitor", "examine", "inspect", "check",
    "test", "try", "attempt", "experiment", "explore", "investigate", "research", "study", "analyze", "review",
    "consider", "contemplate", "ponder", "think", "reflect", "wonder", "question", "doubt", "suspect", "believe",
    "trust", "rely", "depend", "count", "expect", "anticipate", "await", "wait", "delay", "postpone",
    "cancel", "abort", "quit", "resign", "retire", "withdraw", "retreat", "escape", "flee", "run",
    "avoid", "evade", "dodge", "escape", "elude", "trick", "deceive", "cheat", "fraud", "lie",
    "betray", "backstab", "double-cross", "disappoint", "fail", "frustrate", "annoy", "irritate", "bother", "disturb",
    "interrupt", "interfere", "meddle", "intrude", "invade", "trespass", "violate", "break", "disobey", "defy",
    "rebel", "revolt", "protest", "demonstrate", "march", "rally", "strike", "boycott", "resist", "oppose",
    "object", "complain", "grumble", "whine", "nag", "criticize", "blame", "accuse", "charge", "sue",
    "prosecute", "defend", "justify", "excuse", "apologize", "forgive", "pardon", "absolve", "excuse", "overlook",
    "tolerate", "endure", "bear", "stand", "suffer", "experience", "undergo", "encounter", "face", "confront",
    "meet", "greet", "welcome", "receive", "host", "entertain", "amuse", "delight", "please", "satisfy",
    "content", "fulfill", "gratify", "reward", "compensate", "repay", "reimburse", "refund", "return", "restore",
    "recover", "retrieve", "regain", "reclaim", "recapture", "rescue", "save", "deliver", "liberate", "free",
    "release", "discharge", "emit", "radiate", "shine", "glow", "sparkle", "glitter", "flash", "flicker",
    "blink", "wink", "stare", "gaze", "peer", "glimpse", "glance", "peek", "spy", "sneak",
    "creep", "tiptoe", "sneak", "lurk", "prowl", "roam", "wander", "stray", "drift", "float",
    "sail", "navigate", "steer", "drive", "ride", "fly", "soar", "glide", "hover", "land",
    "park", "stop", "halt", "pause", "hesitate", "waver", "falter", "stumble", "trip", "fall",
    "tumble", "collapse", "crumble", "disintegrate", "dissolve", "melt", "freeze", "thaw", "chill", "warm",
    "heat", "burn", "scorch", "singe", "char", "smoke", "steam", "boil", "simmer", "stew",
    "brew", "ferment", "rot", "decay", "decompose", "spoil", "ruin", "contaminate", "pollute", "infect",
    "spread", "transmit", "transfer", "convey", "transport", "carry", "haul", "tow", "drag", "pull",
    "tug", "yank", "jerk", "snatch", "grab", "seize", "capture", "catch", "trap", "snare",
    "entangle", "tangle", "knot", "tie", "bind", "fasten", "attach", "connect", "link", "chain",
    "string", "thread", "weave", "knit", "sew", "stitch", "mend", "repair", "fix", "patch",
    "restore", "renovate", "refurbish", "rebuild", "reconstruct", "remake", "redo", "revise", "edit", "correct",
    "amend", "adjust", "adapt", "modify", "alter", "vary", "differ", "diverge", "deviate", "stray",
    "wander", "drift", "shift", "move", "relocate", "migrate", "immigrate", "emigrate", "settle", "inhabit",
    "occupy", "reside", "dwell", "stay", "remain", "linger", "loiter", "hang", "wait", "expect",
    
    # 1501-2000
    "anticipate", "predict", "forecast", "foresee", "envision", "imagine", "visualize", "picture", "conceive", "invent",
    "devise", "contrive", "scheme", "plot", "plan", "design", "draft", "sketch", "draw", "paint",
    "color", "dye", "stain", "tint", "shade", "darken", "lighten", "brighten", "dim", "fade",
    "bleach", "whiten", "blacken", "redden", "yellow", "green", "blue", "purple", "orange", "brown",
    "gray", "bronze", "copper", "brass", "iron", "steel", "metal", "wood", "stone", "rock",
    "brick", "concrete", "cement", "plaster", "glass", "crystal", "plastic", "rubber", "leather", "cloth",
    "fabric", "textile", "cotton", "wool", "silk", "linen", "polyester", "nylon", "thread", "yarn",
    "rope", "cord", "string", "wire", "cable", "chain", "belt", "strap", "band", "ribbon",
    "tape", "strip", "sheet", "layer", "film", "coating", "cover", "wrapper", "package", "container",
    "vessel", "pot", "pan", "bowl", "cup", "mug", "glass", "bottle", "jar", "can",
    "tin", "carton", "crate", "barrel", "drum", "tank", "tub", "bucket", "basket", "hamper",
    "sack", "pouch", "purse", "wallet", "pocket", "sleeve", "collar", "cuff", "hem", "seam",
    "button", "zipper", "snap", "hook", "clasp", "buckle", "pin", "clip", "clamp", "grip",
    "handle", "knob", "lever", "switch", "button", "key", "lock", "bolt", "latch", "hinge",
    "screw", "nail", "rivet", "pin", "peg", "stake", "post", "pole", "rod", "bar",
    "beam", "plank", "board", "panel", "tile", "brick", "block", "cube", "sphere", "ball",
    "globe", "orb", "disk", "wheel", "ring", "hoop", "loop", "coil", "spiral", "helix",
    "curve", "arc", "bend", "angle", "corner", "point", "tip", "peak", "summit", "crest",
    "ridge", "slope", "hill", "valley", "plain", "plateau", "cliff", "precipice", "gorge", "canyon",
    "ravine", "gully", "ditch", "trench", "pit", "hole", "cavity", "hollow", "depression", "basin",
    "pond", "lake", "reservoir", "pool", "spring", "well", "fountain", "geyser", "stream", "creek",
    "brook", "river", "tributary", "delta", "estuary", "bay", "gulf", "inlet", "cove", "harbor",
    "port", "dock", "pier", "wharf", "jetty", "quay", "marina", "shore", "coast", "beach",
    "sand", "pebble", "gravel", "mud", "clay", "soil", "dirt", "dust", "powder", "grain",
    "particle", "fragment", "piece", "bit", "chunk", "lump", "mass", "bulk", "volume", "capacity",
    "amount", "quantity", "number", "figure", "digit", "numeral", "integer", "fraction", "decimal", "percent",
    "ratio", "proportion", "rate", "speed", "velocity", "acceleration", "momentum", "force", "energy", "power",
    "strength", "intensity", "magnitude", "extent", "degree", "level", "grade", "rank", "class", "category",
    "type", "kind", "sort", "variety", "species", "breed", "strain", "race", "ethnicity", "nationality",
    "citizenship", "identity", "character", "personality", "temperament", "disposition", "mood", "spirit", "morale", "attitude",
    "outlook", "perspective", "viewpoint", "opinion", "belief", "conviction", "principle", "value", "ethic", "moral",
    "virtue", "vice", "sin", "evil", "good", "right", "wrong", "justice", "injustice", "fairness",
    "equality", "inequality", "equity", "balance", "harmony", "discord", "conflict", "tension", "stress", "pressure",
    "strain", "burden", "load", "weight", "mass", "density", "thickness", "width", "breadth", "length",
    "height", "depth", "distance", "space", "gap", "interval", "range", "span", "scope", "scale",
    "size", "dimension", "measurement", "unit", "meter", "inch", "foot", "yard", "mile", "kilometer",
    "gram", "kilogram", "ounce", "pound", "ton", "liter", "gallon", "quart", "pint", "cup",
    "tablespoon", "teaspoon", "drop", "dash", "pinch", "handful", "armful", "mouthful", "bite", "sip",
    "gulp", "swallow", "chew", "bite", "gnaw", "nibble", "munch", "crunch", "champ", "chomp",
    "devour", "consume", "ingest", "digest", "absorb", "assimilate", "metabolize", "process", "convert", "transform",
    "transmute", "translate", "interpret", "decode", "decipher", "unravel", "solve", "resolve", "settle", "decide",
    "conclude", "infer", "deduce", "derive", "extract", "abstract", "summarize", "condense", "compress", "abbreviate",
    "shorten", "truncate", "trim", "clip", "snip", "prune", "crop", "harvest", "reap", "gather",
    "glean", "pick", "pluck", "pull", "uproot", "extract", "remove", "eliminate", "delete", "erase",
    "wipe", "clear", "clean", "purge", "flush", "drain", "empty", "deplete", "exhaust", "consume",
    "spend", "waste", "squander", "fritter", "dissipate", "disperse", "scatter", "spread", "diffuse", "radiate",
    "emanate", "emit", "discharge", "release", "expel", "eject", "evict", "banish", "exile", "deport",
    "transport", "convey", "transmit", "communicate", "express", "articulate", "enunciate", "pronounce", "utter", "voice",
    "vocalize", "verbalize", "speak", "talk", "converse", "chat", "gossip", "chatter", "babble", "prattle",
    "ramble", "digress", "deviate", "stray", "wander", "roam", "drift", "meander", "wind", "snake",
    "twist", "curl", "coil", "spiral", "whirl", "swirl", "spin", "rotate", "revolve", "turn",
    "pivot", "swivel", "swing", "sway", "rock", "wobble", "totter", "teeter", "stagger", "lurch",
    
    # 2001-2500
    "stumble", "trip", "slip", "slide", "glide", "skim", "surf", "ski", "skate", "roll",
    "bowl", "pitch", "throw", "toss", "fling", "hurl", "cast", "launch", "fire", "shoot",
    "blast", "explode", "detonate", "ignite", "kindle", "light", "spark", "flame", "blaze", "burn",
    "sear", "scald", "scorch", "char", "singe", "toast", "roast", "bake", "broil", "grill",
    "fry", "sauté", "simmer", "boil", "steam", "poach", "blanch", "parboil", "stew", "braise",
    "marinate", "season", "spice", "flavor", "salt", "pepper", "sugar", "sweeten", "sour", "bitter",
    "bland", "tasty", "delicious", "yummy", "scrumptious", "appetizing", "savory", "tangy", "zesty", "spicy",
    "hot", "mild", "pungent", "aromatic", "fragrant", "perfumed", "scented", "smelly", "stinky", "foul",
    "rancid", "rotten", "putrid", "fetid", "rank", "musty", "moldy", "stale", "fresh", "crisp",
    "crunchy", "chewy", "tender", "tough", "stringy", "fibrous", "meaty", "juicy", "moist", "dry",
    "parched", "arid", "barren", "desolate", "bleak", "stark", "bare", "naked", "nude", "exposed",
    "revealed", "visible", "apparent", "evident", "manifest", "obvious", "clear", "plain", "distinct", "definite",
    "precise", "exact", "accurate", "correct", "right", "proper", "appropriate", "suitable", "fitting", "apt",
    "relevant", "pertinent", "applicable", "related", "connected", "associated", "linked", "tied", "bound", "attached",
    "fixed", "fastened", "secured", "anchored", "moored", "docked", "berthed", "stationed", "posted", "positioned",
    "placed", "located", "situated", "set", "established", "founded", "instituted", "created", "formed", "organized",
    "structured", "arranged", "ordered", "sorted", "classified", "categorized", "grouped", "clustered", "bunched", "gathered",
    "assembled", "collected", "accumulated", "amassed", "stockpiled", "hoarded", "stored", "warehoused", "stashed", "cached",
    "hidden", "concealed", "disguised", "camouflaged", "masked", "veiled", "shrouded", "cloaked", "covered", "wrapped",
    "enveloped", "enclosed", "surrounded", "encircled", "ringed", "bordered", "edged", "fringed", "lined", "trimmed",
    "decorated", "adorned", "embellished", "ornamented", "beautified", "enhanced", "improved", "upgraded", "refined", "polished",
    "perfected", "optimized", "maximized", "increased", "expanded", "enlarged", "extended", "prolonged", "lengthened", "stretched",
    "widened", "broadened", "deepened", "heightened", "raised", "elevated", "lifted", "hoisted", "hauled", "heaved",
    "dragged", "pulled", "tugged", "drawn", "attracted", "lured", "enticed", "tempted", "seduced", "charmed",
    "captivated", "fascinated", "intrigued", "interested", "engaged", "absorbed", "engrossed", "immersed", "involved", "occupied",
    "preoccupied", "concerned", "worried", "anxious", "nervous", "tense", "stressed", "strained", "pressured", "troubled",
    "disturbed", "upset", "agitated", "flustered", "rattled", "shaken", "shocked", "stunned", "amazed", "astonished",
    "astounded", "surprised", "startled", "alarmed", "frightened", "scared", "terrified", "horrified", "petrified", "paralyzed",
    "frozen", "numb", "dazed", "confused", "bewildered", "puzzled", "perplexed", "baffled", "mystified", "stumped",
    "stuck", "trapped", "caught", "snared", "entangled", "ensnared", "enmeshed", "involved", "implicated", "incriminated",
    "accused", "charged", "indicted", "arraigned", "tried", "judged", "convicted", "sentenced", "punished", "penalized",
    "fined", "imprisoned", "jailed", "incarcerated", "confined", "detained", "held", "kept", "retained", "maintained",
    "preserved", "conserved", "protected", "safeguarded", "secured", "defended", "shielded", "sheltered", "harbored", "housed",
    "accommodated", "lodged", "quartered", "billeted", "stationed", "based", "headquartered", "centered", "focused", "concentrated",
    "centralized", "consolidated", "unified", "integrated", "merged", "combined", "joined", "united", "allied", "partnered",
    "associated", "affiliated", "connected", "linked", "related", "correlated", "corresponded", "matched", "paired", "coupled",
    "mated", "wedded", "married", "engaged", "betrothed", "promised", "pledged", "committed", "dedicated", "devoted",
    "loyal", "faithful", "true", "honest", "sincere", "genuine", "authentic", "real", "actual", "legitimate",
    "valid", "legal", "lawful", "authorized", "approved", "certified", "licensed", "registered", "official", "formal",
    "ceremonial", "ritual", "traditional", "customary", "conventional", "standard", "normal", "regular", "routine", "ordinary",
    "everyday", "common", "usual", "typical", "average", "median", "mean", "middle", "central", "intermediate",
    "moderate", "temperate", "mild", "gentle", "soft", "light", "delicate", "fine", "refined", "subtle",
    "nuanced", "sophisticated", "complex", "complicated", "intricate", "elaborate", "detailed", "thorough", "comprehensive", "complete",
    "total", "entire", "whole", "full", "maximum", "utmost", "extreme", "radical", "drastic", "severe",
    "harsh", "tough", "rigid", "strict", "stern", "austere", "spartan", "plain", "simple", "basic",
    
    # 2501-3000
    "elementary", "fundamental", "essential", "vital", "crucial", "critical", "key", "main", "chief", "principal",
    "primary", "foremost", "leading", "dominant", "prevailing", "prevalent", "widespread", "common", "frequent", "regular",
    "periodic", "recurrent", "repetitive", "cyclical", "seasonal", "annual", "yearly", "monthly", "weekly", "daily",
    "hourly", "momentary", "instantaneous", "immediate", "prompt", "quick", "rapid", "swift", "speedy", "hasty",
    "hurried", "rushed", "urgent", "pressing", "critical", "emergency", "crisis", "disaster", "catastrophe", "calamity",
    "tragedy", "misfortune", "mishap", "accident", "incident", "event", "occurrence", "happening", "episode", "affair",
    "matter", "issue", "subject", "topic", "theme", "motif", "pattern", "design", "layout", "format",
    "structure", "framework", "skeleton", "outline", "draft", "sketch", "blueprint", "scheme", "plan", "program",
    "schedule", "agenda", "timetable", "calendar", "itinerary", "route", "path", "course", "track", "trail",
    "footpath", "walkway", "sidewalk", "pavement", "roadway", "highway", "freeway", "expressway", "motorway", "turnpike",
    "boulevard", "avenue", "street", "lane", "alley", "court", "drive", "terrace", "plaza", "square",
    "circle", "crescent", "grove", "park", "garden", "yard", "lawn", "meadow", "field", "pasture",
    "prairie", "grassland", "savanna", "steppe", "tundra", "desert", "oasis", "jungle", "rainforest", "forest",
    "woodland", "grove", "copse", "thicket", "bush", "shrub", "hedge", "brush", "undergrowth", "vegetation",
    "flora", "fauna", "wildlife", "creature", "organism", "being", "entity", "individual", "specimen", "sample",
    "example", "instance", "case", "illustration", "demonstration", "proof", "evidence", "testimony", "witness", "account",
    "report", "statement", "declaration", "proclamation", "announcement", "notification", "bulletin", "communique", "dispatch", "message",
    "memo", "note", "letter", "epistle", "missive", "correspondence", "mail", "post", "email", "text",
    "sms", "tweet", "post", "blog", "article", "essay", "paper", "document", "file", "record",
    "log", "journal", "diary", "chronicle", "annals", "archives", "history", "biography", "autobiography", "memoir",
    "narrative", "tale", "story", "yarn", "anecdote", "fable", "legend", "myth", "folklore", "tradition",
    "custom", "practice", "habit", "routine", "ritual", "ceremony", "rite", "observance", "celebration", "festival",
    "holiday", "feast", "banquet", "dinner", "supper", "lunch", "brunch", "breakfast", "meal", "course",
    "dish", "plate", "serving", "portion", "helping", "ration", "allowance", "quota", "share", "part",
    "section", "segment", "division", "subdivision", "department", "branch", "wing", "arm", "limb", "member",
    "organ", "tissue", "cell", "molecule", "atom", "particle", "element", "compound", "mixture", "solution",
    "suspension", "emulsion", "colloid", "gel", "solid", "liquid", "gas", "plasma", "matter", "substance",
    "material", "stuff", "thing", "object", "item", "article", "piece", "unit", "component", "part",
    "ingredient", "constituent", "element", "factor", "aspect", "feature", "characteristic", "trait", "quality", "property",
    "attribute", "virtue", "merit", "advantage", "benefit", "asset", "plus", "positive", "pro", "upside",
    "strength", "forte", "talent", "gift", "skill", "ability", "capability", "capacity", "potential", "power",
    "faculty", "aptitude", "knack", "flair", "genius", "brilliance", "intelligence", "wit", "wisdom", "knowledge",
    "learning", "education", "training", "instruction", "teaching", "tuition", "tutoring", "coaching", "mentoring", "guidance",
    "direction", "leadership", "management", "administration", "governance", "control", "authority", "command", "power", "influence",
    "sway", "clout", "leverage", "pull", "weight", "importance", "significance", "consequence", "impact", "effect",
    "result", "outcome", "upshot", "consequence", "aftermath", "sequel", "follow-up", "continuation", "extension", "expansion",
    "growth", "development", "evolution", "progress", "advancement", "improvement", "enhancement", "upgrade", "refinement", "perfection",
    "excellence", "superiority", "preeminence", "supremacy", "dominance", "leadership", "primacy", "precedence", "priority", "preference",
    "choice", "selection", "option", "alternative", "possibility", "chance", "opportunity", "prospect", "potential", "likelihood",
    "probability", "odds", "risk", "danger", "hazard", "threat", "menace", "peril", "jeopardy", "exposure",
    "vulnerability", "weakness", "flaw", "defect", "fault", "error", "mistake", "blunder", "gaffe", "slip",
    "oversight", "omission", "lapse", "failure", "fiasco", "debacle", "disaster", "catastrophe", "tragedy", "loss",
    "defeat", "setback", "reverse", "regression", "decline", "deterioration", "degradation", "decay", "erosion", "corrosion",
    "rust", "tarnish", "stain", "blemish", "spot", "mark", "scar", "scratch", "dent", "chip",
    "crack", "fracture", "break", "rupture", "tear", "split", "rift", "gap", "opening", "hole",
    "cavity", "void", "vacuum", "emptiness", "nothingness", "oblivion", "extinction", "annihilation", "destruction", "devastation",
    "havoc", "chaos", "disorder", "confusion", "turmoil", "upheaval", "unrest", "disturbance", "commotion", "tumult",
    "uproar", "hubbub", "racket", "din", "noise", "sound", "tone", "pitch", "frequency", "wavelength"
]

# Mapping of vowel sounds to Color Vowel Chart categories
VOWEL_SOUND_TO_CATEGORY = {
    # GREEN TEA /iy/ - long E sound
    'ee': 'GREEN TEA', 'ea': 'GREEN TEA', 'e': 'GREEN TEA', 'ie': 'GREEN TEA',
    'ey': 'GREEN TEA', 'i': 'GREEN TEA', 'y': 'GREEN TEA',
    
    # RED PEPPER /ɛ/ - short E sound
    'e_short': 'RED PEPPER', 'ea_short': 'RED PEPPER', 'ie_short': 'RED PEPPER',
    
    # SILVER PIN /ɪ/ - short I sound
    'i_short': 'SILVER PIN', 'y_short': 'SILVER PIN',
    
    # PURPLE SHIRT /ɜr/ - ER sound
    'er': 'PURPLE SHIRT', 'ir': 'PURPLE SHIRT', 'ur': 'PURPLE SHIRT',
    'or_r': 'PURPLE SHIRT', 'ear': 'PURPLE SHIRT',
    
    # BROWN COW /aʊ/ - OW sound
    'ow': 'BROWN COW', 'ou': 'BROWN COW',
    
    # WHITE TIE /aɪ/ - long I sound
    'i_long': 'WHITE TIE', 'igh': 'WHITE TIE', 'y_long': 'WHITE TIE',
    'ie_long': 'WHITE TIE',
    
    # BLACK CAT /æ/ - short A sound
    'a': 'BLACK CAT', 'a_short': 'BLACK CAT',
    
    # OLIVE SOCK /ɑ/ - AH sound
    'o': 'OLIVE SOCK', 'o_short': 'OLIVE SOCK',
    
    # BLUE MOON /u/ - long OO sound
    'oo': 'BLUE MOON', 'u': 'BLUE MOON', 'ue': 'BLUE MOON',
    'ew': 'BLUE MOON', 'ou_long': 'BLUE MOON',
    
    # ROSE PHONE /oʊ/ - long O sound
    'o_long': 'ROSE PHONE', 'oa': 'ROSE PHONE', 'ow_long': 'ROSE PHONE',
    
    # ORANGE BALL /ɔ/ - AW sound
    'al': 'ORANGE BALL', 'au': 'ORANGE BALL', 'aw': 'ORANGE BALL',
    'a_aw': 'ORANGE BALL',
    
    # GRAY DAY /eɪ/ - long A sound
    'a_long': 'GRAY DAY', 'ay': 'GRAY DAY', 'ai': 'GRAY DAY',
    
    # WOODEN HOOK /ʊ/ - short OO sound
    'u_short': 'WOODEN HOOK', 'oo_short': 'WOODEN HOOK', 'ou_short': 'WOODEN HOOK',
    
    # MUSTARD CUP /ʌ/ - UH sound
    'u_uh': 'MUSTARD CUP', 'o_uh': 'MUSTARD CUP', 'ou_uh': 'MUSTARD CUP',
}

# Manual classification of 3000 words (simplified version - you may need to refine)
def classify_word(word):
    """
    Classify a word into a Color Vowel Chart category.
    This is a simplified heuristic-based approach.
    For production, you'd want to use a phonetic dictionary like CMU Pronouncing Dictionary.
    """
    # This is a placeholder - in reality, you'd need phonetic analysis
    # For now, return a basic classification
    
    # Common patterns
    if any(pattern in word for pattern in ['ee', 'ea']) and len(word) > 3:
        return {'category': 'GREEN TEA', 'vowel': 'ee'}
    elif word.endswith('ay') or word.endswith('ake'):
        return {'category': 'GRAY DAY', 'vowel': 'a'}
    elif 'ou' in word and word.endswith(('ound', 'ouse', 'out')):
        return {'category': 'BROWN COW', 'vowel': 'ou'}
    elif 'igh' in word or (word.endswith('ight') or word.endswith('ine')):
        return {'category': 'WHITE TIE', 'vowel': 'i'}
    elif word.endswith('oo') or 'oo' in word:
        return {'category': 'BLUE MOON', 'vowel': 'oo'}
    elif 'er' in word or 'ir' in word or 'ur' in word:
        return {'category': 'PURPLE SHIRT', 'vowel': word[word.find('er'):word.find('er')+2] if 'er' in word else 'ir'}
    elif word.endswith('ust') or word.endswith('ump'):
        return {'category': 'MUSTARD CUP', 'vowel': 'u'}
    elif 'al' in word or 'aw' in word:
        return {'category': 'ORANGE BALL', 'vowel': 'al'}
    elif word.endswith('ook') or word.endswith('ood'):
        return {'category': 'WOODEN HOOK', 'vowel': 'oo'}
    else:
        # Default classification based on word length and structure
        vowels = [c for c in word if c in 'aeiou']
        if vowels:
            main_vowel = vowels[len(vowels)//2] if vowels else 'a'
            if main_vowel == 'a':
                return {'category': 'BLACK CAT', 'vowel': 'a'}
            elif main_vowel == 'e':
                return {'category': 'RED PEPPER', 'vowel': 'e'}
            elif main_vowel == 'i':
                return {'category': 'SILVER PIN', 'vowel': 'i'}
            elif main_vowel == 'o':
                return {'category': 'ROSE PHONE', 'vowel': 'o'}
            elif main_vowel == 'u':
                return {'category': 'MUSTARD CUP', 'vowel': 'u'}
    
    return {'category': 'BLACK CAT', 'vowel': 'a'}

# Generate the word data
def generate_word_data():
    """Generate word classification data for 3000 words"""
    word_data = []
    
    for word in COMMON_WORDS_3000:
        classification = classify_word(word)
        word_data.append({
            'word': word,
            'stressedVowel': classification['vowel'],
            'colorCategory': classification['category'],
            'pronunciation': word  # Simplified - in production use actual pronunciation
        })
    
    return word_data

if __name__ == '__main__':
    import json
    words = generate_word_data()
    print(f"Generated {len(words)} words")
    print(json.dumps(words[:10], indent=2))
