const Event = require('../models/Event');

exports.getAllEvents = async (req, res, next) => {
  try {
    const { category, year, upcoming, flagship, limit } = req.query;
    let query = {};
    if (category) query.category = category;
    if (year) query.year = year;
    if (upcoming === 'true') query.isUpcoming = true;
    if (flagship === 'true') query.isFlagship = true;

    let events = Event.find(query).sort({ startDate: 1 });
    if (limit) events = events.limit(parseInt(limit));

    const data = await events;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

const seedEvents = [
  {
    title: "Hour of Code",
    slug: "hour-of-code-2022",
    category: "outreach",
    tagline: "Taking computer science to 500+ school students",
    description: "During December 2022, the NIT Surat ACM Student Chapter celebrated Computer Science Week by conducting the Hour of Code event. ACM executives visited five schools across Surat and Vadodara, collectively educating over 500 school students from grades 8–10. Each school was visited by a group of executives who gave 1-hour talks covering the importance of computer science, HTML and CSS basics, and future opportunities in tech.",
    startDate: new Date("2022-12-05"),
    endDate: new Date("2022-12-07"),
    venue: "5 Schools across Surat & Vadodara",
    isFlagship: false,
    isUpcoming: false,
    stats: [
      { label: "Schools Visited", value: "5", icon: "school" },
      { label: "Students Reached", value: "500+", icon: "users" },
      { label: "Grades", value: "8–10", icon: "graduation-cap" }
    ],
    tags: ["Outreach","CSWeek","HourOfCode","Schools"],
    achievement: "Special Mention — Best Regional Student Chapter",
    bannerGradient: "linear-gradient(135deg, #064E3B, #059669)",
    year: 2022
  },
  {
    title: "Epiphany 12.1",
    slug: "epiphany-12-1",
    category: "competition",
    edition: "12.1",
    tagline: "National competitive programming, redefined",
    description: "Epiphany is a national-level competitive programming contest conducted at least once every year by ACM NIT Surat. The contest involves a 2–3 hour event where problems are carefully curated by ACM's own problem setters — unique, interesting, and original. Solutions are published post-contest and winners receive monetary rewards.",
    startDate: new Date("2023-01-23"),
    venue: "Online / Codeforces",
    isOnline: true,
    isFlagship: true,
    stats: [
      { label: "Level", value: "National", icon: "globe" },
      { label: "Duration", value: "2–3 Hours", icon: "clock" },
      { label: "Problems", value: "Unique/Original", icon: "code" }
    ],
    tags: ["NationalLevel","CompetitiveProgramming","Epiphany","MonetaryRewards"],
    bannerGradient: "linear-gradient(135deg, #1E3A8A, #2563EB)",
    year: 2023
  },
  {
    title: "DotSlash 6.0",
    slug: "dotslash-6-0",
    category: "hackathon",
    edition: "6.0",
    tagline: "30 hours. One mission. Build something that matters.",
    description: "The flagship event of ACM NIT Surat, DotSlash is a 30-hour national-level hackathon organized annually in association with Research Park at SVNIT, Surat. DotSlash is one of the biggest hackathons in Gujarat — teams from all over India register, with 40 selected to compete offline. Teams work for 30 hours straight building innovative solutions for given problem statements. Mentors provide assistance in ideas, inspiration, technical help and critiques. Top 3 winning teams are selected through combined scores from mentors and experienced judges and receive monetary rewards.",
    startDate: new Date("2023-02-18"),
    endDate: new Date("2023-02-19"),
    venue: "Research Park, SVNIT Surat",
    isFlagship: true,
    stats: [
      { label: "Duration", value: "30 Hours", icon: "clock" },
      { label: "Teams Offline", value: "40", icon: "users" },
      { label: "Level", value: "National", icon: "globe" }
    ],
    tags: ["Hackathon","Flagship","30Hours","National","Gujarat","ResearchPark"],
    achievement: "Flagship Event",
    bannerGradient: "linear-gradient(135deg, #7F1D1D, #DC2626)",
    year: 2023
  },
  {
    title: "CodeWars",
    slug: "codewars-2023",
    category: "competition",
    tagline: "Compete at Gujarat's biggest tech fest",
    description: "CodeWars is a programming contest held by ACM NIT Surat in association with MINDBEND — one of the biggest technical fests in Gujarat. The event tests algorithmic thinking, speed, and accuracy under competition conditions.",
    startDate: new Date("2023-03-31"),
    venue: "MINDBEND, SVNIT",
    stats: [
      { label: "Association", value: "MINDBEND", icon: "handshake" },
      { label: "Level", value: "Gujarat", icon: "map-pin" }
    ],
    tags: ["CodeWars","MINDBEND","Competition","Gujarat"],
    bannerGradient: "linear-gradient(135deg, #1E3A8A, #4F46E5)",
    year: 2023
  },
  {
    title: "ACM Summer Challenge",
    slug: "acm-summer-challenge-2023",
    category: "workshop",
    tagline: "Zero to DSA hero in 30 days",
    description: "The Summer Challenge is a unique endeavor by ACM NIT Surat that teaches young CS enthusiasts the fundamentals of data structures, algorithms, and programming over a 30-day period. No prior experience is required. Problem setters hand-pick, curate and create weekly problems tailored to students' current progress. After each problem set, a problem setter solves them live, teaching the right approach. Difficulty increments every week, giving a complete understanding of key CP topics by month's end.",
    startDate: new Date("2023-07-08"),
    endDate: new Date("2023-08-10"),
    isOnline: true,
    stats: [
      { label: "Duration", value: "30 Days", icon: "calendar" },
      { label: "Weeks", value: "4", icon: "layers" },
      { label: "Prereqs", value: "None", icon: "check" }
    ],
    tags: ["DSA","CPTraining","30Days","Beginners","Online"],
    bannerGradient: "linear-gradient(135deg, #3B0764, #7C3AED)",
    year: 2023
  },
  {
    title: "SIH 2023 Stage 1: Ideathon",
    slug: "sih-2023-ideathon",
    category: "hackathon",
    tagline: "Shaping SVNIT's best ideas for the nation",
    description: "SIH (Smart India Hackathon) is a national-level hackathon facilitated by the Government of India. To filter the top 30 teams from SVNIT and help them submit their best ideas, ACM NIT Surat, in collaboration with DSC NIT Surat, conducted a faculty mentorship session. Participants presented their ideas to a panel of faculty members who graded them and gave critiques, enabling teams to improve their pitch for the national stage.",
    startDate: new Date("2023-09-16"),
    venue: "SVNIT Campus",
    stats: [
      { label: "Teams Selected", value: "Top 30", icon: "trophy" },
      { label: "Collaboration", value: "DSC NIT Surat", icon: "users" }
    ],
    tags: ["SIH2023","SmartIndiaHackathon","GovtOfIndia","Ideathon","DSC"],
    bannerGradient: "linear-gradient(135deg, #78350F, #D97706)",
    year: 2023
  },
  {
    title: "Open Source Workshop",
    slug: "open-source-workshop-2023",
    category: "workshop",
    tagline: "Git, GitHub, and the open-source way",
    description: "ACM NIT Surat hosted a highly informative workshop on Git, GitHub, and open-source contributions. The workshop drew 57 attendees from second-year students and featured 9 active core committee members. Held in the Old CSE Dept Classroom on 9th October 2023, the 2-hour session provided comprehensive insights into Git commands, GitHub mechanics, and the significance of Hacktoberfest in the open-source community.",
    startDate: new Date("2023-10-09"),
    venue: "Old CSE Dept Classroom, SVNIT",
    stats: [
      { label: "Attendees", value: "57", icon: "users" },
      { label: "Duration", value: "2 Hours", icon: "clock" },
      { label: "Committee Members", value: "9", icon: "star" }
    ],
    tags: ["Git","GitHub","OpenSource","Hacktoberfest","Workshop"],
    bannerGradient: "linear-gradient(135deg, #042F2E, #0F766E)",
    year: 2023
  },
  {
    title: "Inception 8.0",
    slug: "inception-8-0",
    category: "competition",
    edition: "8.0",
    tagline: "The college-level CP battle returns",
    description: "On 27th October 2023, ACM NIT Surat conducted the 8th iteration of Inception — the college-level competitive programming contest. The contest took place 1:30 PM–4:30 PM in Lab I and Lab II at the Central Computer Centre (CCC). Students competed in groups of two or three. Both second and third-year students participated, with prize money of ₹3,000 distributed among the three winning teams from second-year students.",
    startDate: new Date("2023-10-27"),
    venue: "Lab I & Lab II, Central Computer Centre (CCC), SVNIT",
    stats: [
      { label: "Edition", value: "8th", icon: "award" },
      { label: "Duration", value: "3 Hours", icon: "clock" },
      { label: "Prize Money", value: "₹3,000", icon: "indian-rupee" }
    ],
    tags: ["Inception","CP","College","TeamContest","CCC"],
    bannerGradient: "linear-gradient(135deg, #1E3A8A, #0066FF)",
    year: 2023
  }
];

exports.seedEvents = async (req, res, next) => {
  try {
    await Event.deleteMany();
    await Event.insertMany(seedEvents);
    res.json({ success: true, message: 'Events seeded successfully!' });
  } catch (error) {
    next(error);
  }
};
