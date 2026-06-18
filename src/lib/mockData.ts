// REAL CANADIAN VENUES — Actual businesses with verified websites & social media
// All images are real photos from web search, NOT AI-generated

const cancellationLabels: Record<string, { label: string; badge: string; description: string }> = {
  free: { label: "Free Cancellation", badge: "FREE", description: "Cancel anytime before your reservation \u2014 no charge, no questions." },
  "24h_full": { label: "Full Refund \u2014 24h", badge: "100%", description: "Cancel 24+ hours before for a full refund." },
  "48h_full": { label: "Full Refund \u2014 48h", badge: "100%", description: "Cancel 48+ hours before for a full refund." },
  "72h_full": { label: "Full Refund \u2014 72h", badge: "100%", description: "Cancel 72+ hours before for a full refund." },
  "24h_90": { label: "90% Refund \u2014 24h", badge: "90%", description: "Cancel 24+ hours before and get 90% back. 10% covers processing." },
  non_refundable: { label: "Non-Refundable", badge: "0%", description: "This reservation is non-refundable. Please plan accordingly." },
};

export const getCancellationInfo = (key: string) => cancellationLabels[key] || cancellationLabels["24h_full"];

export const mockVenues = [
  // ===================== RESTAURANTS =====================
  {
    id: 1, name: "Miku Vancouver", slug: "miku-vancouver", categoryId: 1, cityId: 1,
    description: "Waterfront Japanese restaurant famous for flame-seared Aburi sushi and stunning ocean views. A Vancouver icon since 2008.",
    address: "200 Granville St #70", neighborhood: "Downtown Waterfront", city: "Vancouver",
    phone: "(604) 568-3900", website: "https://mikurestaurant.com", instagram: "@mikuvancouver",
    priceLevel: 3, rating: 4.8, reviewCount: 2847, cuisine: "Japanese", subcategories: ["Sushi", "Waterfront", "Fine Dining"],
    features: ["Waterfront View", "Full Bar", "Private Dining", "Patio"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 12, image: "/venues/miku-vancouver.jpg"
  },
  {
    id: 2, name: "Joe Fortes Seafood & Chop House", slug: "joe-fortes", categoryId: 1, cityId: 1,
    description: "Classic seafood and chop house with award-winning oysters and a famous rooftop patio. A Vancouver institution since 1985.",
    address: "777 Thurlow St", neighborhood: "Downtown", city: "Vancouver",
    phone: "(604) 669-1940", website: "https://joefortes.ca", instagram: "@joefortes",
    priceLevel: 3, rating: 4.6, reviewCount: 3102, cuisine: "Seafood", subcategories: ["Oysters", "Patio", "Steakhouse"],
    features: ["Patio", "Live Music", "Full Bar", "Private Dining"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "24h_full",
    bookedToday: 8, image: "/venues/joe-fortes.jpg"
  },
  {
    id: 3, name: "Alo Restaurant", slug: "alo-toronto", categoryId: 1, cityId: 2,
    description: "French tasting menu in an elegant third-floor space. Consistently ranked among Canada's best restaurants.",
    address: "163 Spadina Ave, 3rd Floor", neighborhood: "Queen West", city: "Toronto",
    phone: "(416) 260-2222", website: "https://alorestaurant.com", instagram: "@alotoronto",
    priceLevel: 4, rating: 4.9, reviewCount: 1876, cuisine: "French", subcategories: ["Tasting Menu", "Fine Dining", "Date Night"],
    features: ["Private Dining", "Full Bar", "Tasting Menu"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: true, cancellationPolicy: "48h_full",
    bookedToday: 6, image: "/venues/alo-toronto.jpg"
  },
  {
    id: 4, name: "Schwartz's Deli", slug: "schwartzs-deli", categoryId: 1, cityId: 3,
    description: "Montreal institution since 1928. World-famous smoked meat sandwiches stacked high. A must-visit Canadian landmark.",
    address: "3895 Boul. Saint-Laurent", neighborhood: "Plateau-Mont-Royal", city: "Montreal",
    phone: "(514) 842-4813", website: "https://schwartzsdeli.com", instagram: "@schwartzsdeli",
    priceLevel: 1, rating: 4.7, reviewCount: 5621, cuisine: "Jewish Deli", subcategories: ["Sandwich", "Casual", "Iconic"],
    features: ["Takeout", "Cash Only", "No Reservations"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 24, image: "/venues/schwartzs-deli.jpg"
  },
  {
    id: 5, name: "Published on Main", slug: "published-on-main", categoryId: 1, cityId: 1,
    description: "Canada's #1 ranked restaurant 2024. Hyper-local ingredients, innovative cocktails, and an unforgettable tasting menu experience.",
    address: "3593 Main St", neighborhood: "Mount Pleasant", city: "Vancouver",
    phone: "(604) 566-9900", website: "https://publishedonmain.com", instagram: "@publishedonmain",
    priceLevel: 4, rating: 4.9, reviewCount: 1432, cuisine: "Contemporary Canadian", subcategories: ["Tasting Menu", "Fine Dining", "Award Winning"],
    features: ["Tasting Menu", "Full Bar", "Wine Pairing"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: true, cancellationPolicy: "72h_full",
    bookedToday: 4, image: "/venues/published-on-main.jpg"
  },
  {
    id: 6, name: "Savio Volpe", slug: "savio-volpe", categoryId: 1, cityId: 1,
    description: "Osteria-style Italian restaurant inspired by a fictional muse. Pasta, wood-fired dishes, and one of Vancouver's best wine lists.",
    address: "615 Kingsway", neighborhood: "Fraserhood", city: "Vancouver",
    phone: "(604) 428-0072", website: "https://saviovolpe.com", instagram: "@saviovolpe",
    priceLevel: 2, rating: 4.7, reviewCount: 2156, cuisine: "Italian", subcategories: ["Pasta", "Wood-Fired", "Neighbourhood"],
    features: ["Patio", "Full Bar", "Walk-in Welcome"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "24h_full",
    bookedToday: 9, image: "/venues/savio-volpe.jpg"
  },
  {
    id: 7, name: "Bar Raval", slug: "bar-raval", categoryId: 3, cityId: 2,
    description: "Spanish pintxos and natural wines in a stunning Gaudi-inspired carved wood interior. No reservations \u2014 walk-in only.",
    address: "505 College St", neighborhood: "Little Italy", city: "Toronto",
    phone: "(416) 546-2191", website: "https://www.thisisbarraval.com", instagram: "@barraval",
    priceLevel: 2, rating: 4.6, reviewCount: 2345, cuisine: "Spanish", subcategories: ["Tapas", "Wine Bar", "Date Night"],
    features: ["Patio", "Natural Wine", "Walk-in Only"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 15, image: "/venues/bar-raval.jpg"
  },
  {
    id: 8, name: "Canoe Restaurant", slug: "canoe-toronto", categoryId: 1, cityId: 2,
    description: "Contemporary Canadian cuisine on the 54th floor of the TD Centre with panoramic views of Toronto's skyline and Lake Ontario.",
    address: "66 Wellington St W, 54th Floor", neighborhood: "Financial District", city: "Toronto",
    phone: "(416) 364-0054", website: "https://www.canoerestaurant.com", instagram: "@canoe_restaurant",
    priceLevel: 4, rating: 4.7, reviewCount: 1987, cuisine: "Canadian", subcategories: ["Fine Dining", "Views", "Business"],
    features: ["City Views", "Private Dining", "Full Bar"],
    isVerified: true, isTrending: false, isFeatured: true, depositRequired: true, cancellationPolicy: "48h_full",
    bookedToday: 7, image: "/venues/canoe-toronto.jpg"
  },
  {
    id: 9, name: "Fairmont Le Ch\u00e2teau Frontenac", slug: "chateau-frontenac", categoryId: 1, cityId: 5,
    description: "Iconic castle hotel overlooking the St. Lawrence River. Home to the 1608 Wine & Cheese Bar and Champlain restaurant \u2014 a UNESCO landmark.",
    address: "1 Rue des Carri\u00e8res", neighborhood: "Old Quebec", city: "Quebec City",
    phone: "(418) 692-3861", website: "https://www.fairmont.com/frontenac-quebec", instagram: "@fairmontfrontenac",
    priceLevel: 4, rating: 4.8, reviewCount: 8934, cuisine: "Fine Dining", subcategories: ["Luxury", "Views", "Historic"],
    features: ["Waterfront View", "Hotel Dining", "Wine Bar"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "24h_full",
    bookedToday: 18, image: "/venues/chateau-frontenac-aerial.jpg"
  },
  {
    id: 10, name: "El Catrin Destileria", slug: "el-catrin", categoryId: 1, cityId: 2,
    description: "Vibrant Mexican restaurant with one of Toronto's best patios in the historic Distillery District. Award-winning margaritas.",
    address: "18 Tank House Lane", neighborhood: "Distillery District", city: "Toronto",
    phone: "(416) 203-2121", website: "https://elcatrin.ca", instagram: "@elcatrinto",
    priceLevel: 2, rating: 4.5, reviewCount: 3456, cuisine: "Mexican", subcategories: ["Patio", "Margaritas", "Group Friendly"],
    features: ["Patio", "Full Bar", "Tequila Bar"],
    isVerified: true, isTrending: false, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 11, image: "/venues/steam-whistle.jpg"
  },
  {
    id: 11, name: "Damas Restaurant", slug: "damas-montreal", categoryId: 1, cityId: 3,
    description: "One of Montreal's most beautiful restaurants. Syrian-inspired Middle Eastern cuisine in an opulent, magical setting.",
    address: "1201 Ave Van Horne", neighborhood: "Outremont", city: "Montreal",
    phone: "(514) 439-5435", website: "https://damas.ca", instagram: "@damasrestaurant",
    priceLevel: 3, rating: 4.8, reviewCount: 3245, cuisine: "Middle Eastern", subcategories: ["Syrian", "Fine Dining", "Date Night"],
    features: ["Full Bar", "Private Dining", "Reservations Required"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: true, cancellationPolicy: "24h_full",
    bookedToday: 8, image: "/venues/damas-montreal.jpg"
  },
  // ===================== ACTIVITIES =====================
  {
    id: 12, name: "The Rec Room", slug: "rec-room", categoryId: 6, cityId: 2,
    description: "50,000+ sq ft of games, live entertainment, and Canadian-inspired cuisine. Arcade, bowling, The Yard, and live shows under one roof.",
    address: "255 Bremner Blvd", neighborhood: "South Core", city: "Toronto",
    phone: "(416) 307-3010", website: "https://www.therecroom.com", instagram: "@therecroom",
    priceLevel: 2, rating: 4.5, reviewCount: 4521, cuisine: "Arcade", subcategories: ["Arcade", "Bowling", "Bar"],
    features: ["Games", "Full Bar", "Live Shows", "Food"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 32, image: "/venues/rec-room.jpg"
  },
  {
    id: 13, name: "Commodore Lanes & Billiards", slug: "commodore-lanes", categoryId: 6, cityId: 1,
    description: "Canada's oldest surviving recreation centre since 1930. 12 lanes of 5-pin bowling, 20 billiard tables, and a lounge.",
    address: "838 Granville St", neighborhood: "Granville Entertainment", city: "Vancouver",
    phone: "(604) 681-1531", website: "https://commodorelanes.ca", instagram: "@commodorelanes",
    priceLevel: 1, rating: 4.4, reviewCount: 1876, cuisine: "Bowling", subcategories: ["Bowling", "Billiards", "Historic"],
    features: ["5-Pin Bowling", "20 Pool Tables", "Arcade"],
    isVerified: true, isTrending: false, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 14, image: "/venues/commodore-lanes.jpg"
  },
  {
    id: 14, name: "TRAPPED Escape Room", slug: "trapped-escape", categoryId: 6, cityId: 2,
    description: "Canada's largest premium escape room chain \u2014 25 locations, 28 immersive themes. 4.8 stars across 20,000+ Google reviews.",
    address: "1185 Queen St W", neighborhood: "West Queen West", city: "Toronto",
    phone: "(647) 341-1994", website: "https://trapped.com", instagram: "@trappedcanada",
    priceLevel: 2, rating: 4.7, reviewCount: 2341, cuisine: "Escape Room", subcategories: ["Escape Room", "Team Building", "Adventure"],
    features: ["25 Locations", "Private Rooms", "Multiple Themes"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "24h_full",
    bookedToday: 22, image: "/venues/trapped-escape.jpg"
  },
  {
    id: 15, name: "BATL \u2014 Backyard Axe Throwing League", slug: "batl-axe", categoryId: 6, cityId: 2,
    description: "The original urban axe throwing experience. Expert coaches, group packages, and leagues. The sport that started in a Toronto backyard.",
    address: "6-845 Wellington St E", neighborhood: "The Junction", city: "Toronto",
    phone: "(647) 340-2233", website: "https://batlgrounds.com", instagram: "@batlgrounds",
    priceLevel: 2, rating: 4.6, reviewCount: 1567, cuisine: "Axe Throwing", subcategories: ["Axe Throwing", "Groups", "Competitive"],
    features: ["Group Activity", "Coaching", "Leagues", "Licensed Bar"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "24h_full",
    bookedToday: 19, image: "/venues/batl-axe.jpg"
  },
  {
    id: 16, name: "Cabot Cliffs Golf Course", slug: "cabot-cliffs", categoryId: 7, cityId: 9,
    description: "Ranked #1 golf course in Canada. Bill Coore & Ben Crenshaw design on Cape Breton's stunning coastline. A bucket-list destination.",
    address: "15933 Central Ave", neighborhood: "Inverness", city: "Cape Breton, NS",
    phone: "(902) 258-4653", website: "https://cabotcapebreton.com", instagram: "@cabotcapebreton",
    priceLevel: 4, rating: 4.9, reviewCount: 876, cuisine: "Golf", subcategories: ["Golf", "Luxury", "Outdoor"],
    features: ["18 Holes", "Ocean Views", "Resort", "Pro Shop"],
    isVerified: true, isTrending: false, isFeatured: true, depositRequired: true, cancellationPolicy: "48h_full",
    bookedToday: 5, image: "/venues/cabot-cliffs-golf.jpg"
  },
  // ===================== ENTERTAINMENT =====================
  {
    id: 17, name: "Yuk Yuk's Comedy Club", slug: "yuk-yuks", categoryId: 8, cityId: 2,
    description: "Canada's premier comedy club since 1976. Stand-up shows every night featuring top Canadian and international talent.",
    address: "224 Richmond St W", neighborhood: "Entertainment District", city: "Toronto",
    phone: "(416) 967-6425", website: "https://yukyuks.com", instagram: "@yukyuks",
    priceLevel: 2, rating: 4.5, reviewCount: 3456, cuisine: "Comedy", subcategories: ["Stand-Up", "Live Show", "Date Night"],
    features: ["Live Shows", "Full Bar", "Dinner & Show"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 45, image: "/venues/yuk-yuks.jpg"
  },
  {
    id: 18, name: "Steam Whistle Brewing", slug: "steam-whistle", categoryId: 3, cityId: 2,
    description: "Toronto's iconic craft brewery in the historic Roundhouse. Tours, tastings, events, and Canada's best pilsner since 2000.",
    address: "255 Bremner Blvd", neighborhood: "South Core", city: "Toronto",
    phone: "(416) 362-2337", website: "https://steamwhistle.ca", instagram: "@steamwhistle",
    priceLevel: 1, rating: 4.6, reviewCount: 5432, cuisine: "Craft Brewery", subcategories: ["Beer", "Tours", "Events"],
    features: ["Brewery Tours", "Tasting Hall", "Events", "Patio"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "free",
    bookedToday: 28, image: "/venues/steam-whistle.jpg"
  },
  // ===================== EXPERIENCES =====================
  {
    id: 19, name: "Mission Hill Family Estate Winery", slug: "mission-hill", categoryId: 9, cityId: 8,
    description: "Award-winning Okanagan winery with a stunning bell tower, underground cellar, and world-class Terrace Restaurant.",
    address: "1730 Mission Hill Rd", neighborhood: "West Kelowna", city: "Kelowna",
    phone: "(250) 768-7611", website: "https://missionhillwinery.com", instagram: "@missionhillwine",
    priceLevel: 3, rating: 4.8, reviewCount: 2345, cuisine: "Wine Tasting", subcategories: ["Winery", "Tasting", "Restaurant"],
    features: ["Wine Tastings", "Vineyard Tours", "Terrace Restaurant", "Bell Tower"],
    isVerified: true, isTrending: true, isFeatured: true, depositRequired: false, cancellationPolicy: "24h_full",
    bookedToday: 15, image: "/venues/mission-hill-winery.jpg"
  },
];

export const mockCategories = [
  { id: 1, name: "Restaurants", slug: "restaurants", icon: "utensils", color: "#FF6B4A", description: "Fine dining to casual eats" },
  { id: 2, name: "Caf\u00e9s & Coffee", slug: "cafes", icon: "coffee", color: "#8B5CF6", description: "Best brews in town" },
  { id: 3, name: "Bars & Lounges", slug: "bars", icon: "wine", color: "#EC4899", description: "Cocktails and nightlife" },
  { id: 4, name: "Date Night", slug: "date-night", icon: "heart", color: "#F43F5E", description: "Romantic spots" },
  { id: 5, name: "Brunch", slug: "brunch", icon: "sun", color: "#F59E0B", description: "Weekend mimosas" },
  { id: 6, name: "Arcades & Games", slug: "arcades", icon: "gamepad", color: "#10B981", description: "Arcade, bowling, escape rooms" },
  { id: 7, name: "Sports & Adventure", slug: "sports", icon: "trophy", color: "#059669", description: "Golf, climbing, axe throwing" },
  { id: 8, name: "Entertainment", slug: "entertainment", icon: "music", color: "#3B82F6", description: "Comedy, shows, breweries" },
  { id: 9, name: "Experiences", slug: "experiences", icon: "palette", color: "#6366F1", description: "Wineries, tastings, tours" },
  { id: 10, name: "Outdoor", slug: "outdoor", icon: "mountain", color: "#14B8A6", description: "Parks, trails, outdoor fun" },
];

export const activityTypes = [
  { slug: "golf", name: "Golf", icon: "golf", color: "#2D6A4F", image: "/venues/cabot-cliffs-golf.jpg" },
  { slug: "bowling", name: "Bowling", icon: "bowling", color: "#E67E22", image: "/venues/commodore-lanes.jpg" },
  { slug: "arcade", name: "Arcade", icon: "gamepad", color: "#9B5DE5", image: "/venues/rec-room.jpg" },
  { slug: "escape-room", name: "Escape Room", icon: "puzzle", color: "#E63946", image: "/venues/trapped-escape.jpg" },
  { slug: "axe-throwing", name: "Axe Throwing", icon: "axe", color: "#8B4513", image: "/venues/batl-axe.jpg" },
  { slug: "comedy", name: "Comedy Club", icon: "mic", color: "#F4A261", image: "/venues/yuk-yuks.jpg" },
  { slug: "brewery", name: "Brewery Tour", icon: "beer", color: "#F59E0B", image: "/venues/steam-whistle.jpg" },
  { slug: "winery", name: "Wine Tasting", icon: "grape", color: "#6B2737", image: "/venues/mission-hill-winery.jpg" },
  { slug: "sushi", name: "Sushi", icon: "fish", color: "#E63946", image: "/venues/miku-vancouver.jpg" },
  { slug: "fine-dining", name: "Fine Dining", icon: "crown", color: "#C9A227", image: "/venues/published-on-main.jpg" },
  { slug: "patio", name: "Patio Dining", icon: "sun", color: "#FF6B4A", image: "/venues/joe-fortes.jpg" },
  { slug: "historic", name: "Historic", icon: "landmark", color: "#457B9D", image: "/venues/chateau-frontenac-aerial.jpg" },
];

export const mockCities = [
  { id: 1, name: "Vancouver", province: "BC", slug: "vancouver" },
  { id: 2, name: "Toronto", province: "ON", slug: "toronto" },
  { id: 3, name: "Montreal", province: "QC", slug: "montreal" },
  { id: 4, name: "Calgary", province: "AB", slug: "calgary" },
  { id: 5, name: "Quebec City", province: "QC", slug: "quebec-city" },
  { id: 6, name: "Ottawa", province: "ON", slug: "ottawa" },
  { id: 7, name: "Edmonton", province: "AB", slug: "edmonton" },
  { id: 8, name: "Kelowna", province: "BC", slug: "kelowna" },
  { id: 9, name: "Cape Breton", province: "NS", slug: "cape-breton" },
  { id: 10, name: "Winnipeg", province: "MB", slug: "winnipeg" },
];

export const mockDeals = [
  { id: 1, venueId: 2, title: "Happy Hour Oysters", description: "$2 oysters weekdays 3-6PM at Joe Fortes", code: "HHOYSTER", discount: "50%", expiresAt: "2026-07-31", venue: { name: "Joe Fortes" } },
  { id: 2, venueId: 7, title: "Wine Wednesday", description: "Half-price select wine bottles every Wednesday at Bar Raval", code: "WINEWED", discount: "50%", expiresAt: "2026-08-15", venue: { name: "Bar Raval" } },
  { id: 3, venueId: 1, title: "Lunch Set Menu", description: "$35 Aburi lunch set at Miku \u2014 limited time", code: "MIKULUNCH", discount: "$35", expiresAt: "2026-07-20", venue: { name: "Miku Vancouver" } },
  { id: 4, venueId: 12, title: "Game Night Special", description: "50% off game passes every Tuesday at The Rec Room", code: "GAMENIGHT", discount: "50%", expiresAt: "2026-07-31", venue: { name: "The Rec Room" } },
  { id: 5, venueId: 14, title: "Escape Duo Deal", description: "2 escape room tickets for the price of 1, Mon-Wed", code: "ESCAPEDUO", discount: "BOGO", expiresAt: "2026-08-15", venue: { name: "TRAPPED" } },
  { id: 6, venueId: 18, title: "Brewery Tour & Taste", description: "Free brewery tour with any tasting flight at Steam Whistle", code: "TOURFREE", discount: "FREE", expiresAt: "2026-08-31", venue: { name: "Steam Whistle" } },
];

export const mockPlans = [
  { id: 1, title: "Perfect Vancouver Date Night", slug: "vancouver-date-night", cityId: 1, description: "An unforgettable evening: Aburi sushi at Miku, a sunset walk, and cocktails at a hidden bar.", totalDuration: "5 hours", estimatedCost: "$$$", occasion: "Date Night" },
  { id: 2, title: "Toronto Activity Day", slug: "toronto-activity-day", cityId: 2, description: "The ultimate Toronto day: axe throwing, arcade games at The Rec Room, comedy show, and late-night tapas.", totalDuration: "8 hours", estimatedCost: "$$", occasion: "Friends" },
  { id: 3, title: "Montreal Food Tour", slug: "montreal-food-tour", cityId: 3, description: "Experience Montreal's legendary food scene: smoked meat, Middle Eastern fine dining, and French bistro.", totalDuration: "6 hours", estimatedCost: "$$", occasion: "Foodies" },
  { id: 4, title: "Toronto Thrill Day", slug: "toronto-thrill", cityId: 2, description: "Escape rooms, axe throwing, and brewery hopping \u2014 the ultimate adventure-packed day.", totalDuration: "7 hours", estimatedCost: "$$", occasion: "Adventure" },
  { id: 5, title: "Okanagan Wine Weekend", slug: "okanagan-wine", cityId: 8, description: "World-class wine tasting at Mission Hill, vineyard tour, and farm-to-table dining in the valley.", totalDuration: "6 hours", estimatedCost: "$$$", occasion: "Romance" },
];

export const mockPlanItems = [
  { id: 1, planId: 1, venueId: 1, order: 1, timeOfDay: "6:00 PM", duration: "2 hours", notes: "Start with Aburi sushi and waterfront views at Miku" },
  { id: 2, planId: 1, venueId: null, order: 2, timeOfDay: "8:30 PM", duration: "1 hour", notes: "Sunset walk along the Coal Harbour seawall" },
  { id: 3, planId: 1, venueId: 6, order: 3, timeOfDay: "10:00 PM", duration: "2 hours", notes: "Italian wine and wood-fired dishes at Savio Volpe" },
  { id: 4, planId: 2, venueId: 15, order: 1, timeOfDay: "11:00 AM", duration: "1.5 hours", notes: "Learn to throw axes at BATL" },
  { id: 5, planId: 2, venueId: 12, order: 2, timeOfDay: "1:00 PM", duration: "2.5 hours", notes: "Arcade games, bowling, and lunch at The Rec Room" },
  { id: 6, planId: 2, venueId: 17, order: 3, timeOfDay: "7:00 PM", duration: "2 hours", notes: "Laugh out loud at Yuk Yuk's Comedy Club" },
  { id: 7, planId: 2, venueId: 7, order: 4, timeOfDay: "9:30 PM", duration: "1.5 hours", notes: "Late-night pintxos and natural wine at Bar Raval" },
  { id: 8, planId: 3, venueId: 4, order: 1, timeOfDay: "12:00 PM", duration: "1.5 hours", notes: "The original smoked meat sandwich at Schwartz's" },
  { id: 9, planId: 3, venueId: 11, order: 2, timeOfDay: "2:00 PM", duration: "2 hours", notes: "Syrian fine dining at Damas" },
  { id: 10, planId: 3, venueId: 7, order: 3, timeOfDay: "5:00 PM", duration: "2 hours", notes: "Spanish tapas and natural wine" },
  { id: 11, planId: 4, venueId: 14, order: 1, timeOfDay: "11:00 AM", duration: "1.5 hours", notes: "Solve puzzles at TRAPPED Escape Room" },
  { id: 12, planId: 4, venueId: 15, order: 2, timeOfDay: "1:30 PM", duration: "1.5 hours", notes: "Axe throwing competition at BATL" },
  { id: 13, planId: 4, venueId: 18, order: 3, timeOfDay: "4:00 PM", duration: "2 hours", notes: "Brewery tour and tasting at Steam Whistle" },
  { id: 14, planId: 5, venueId: 19, order: 1, timeOfDay: "11:00 AM", duration: "2 hours", notes: "Wine tasting at Mission Hill's bell tower" },
  { id: 15, planId: 5, venueId: 19, order: 2, timeOfDay: "1:30 PM", duration: "2 hours", notes: "Lunch at The Terrace restaurant overlooking vineyards" },
];

export function getMockVenueBySlug(slug: string) {
  return mockVenues.find(v => v.slug === slug) || mockVenues[0];
}

export function getMockVenueById(id: number) {
  return mockVenues.find(v => v.id === id);
}

export function getMockDeals() {
  return mockDeals;
}

export function getMockPlans() {
  return mockPlans.map(p => ({
    ...p,
    items: mockPlanItems.filter(i => i.planId === p.id)
  }));
}

export function getVenuesByCategory(categorySlug: string) {
  const cat = mockCategories.find(c => c.slug === categorySlug);
  if (!cat) return mockVenues;
  return mockVenues.filter(v => v.categoryId === cat.id);
}

export function getVenuesByActivityType(typeSlug: string) {
  return mockVenues.filter(v => {
    const subcats = (v.subcategories || []).map((s: string) => s.toLowerCase().replace(/\s+/g, '-'));
    return subcats.includes(typeSlug) || v.cuisine?.toLowerCase().replace(/\s+/g, '-') === typeSlug;
  });
}

export function getTrendingVenues() {
  return mockVenues.filter(v => v.isTrending).slice(0, 8);
}

export function getFeaturedVenues() {
  return mockVenues.filter(v => v.isFeatured).slice(0, 8);
}
