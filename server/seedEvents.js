require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const FALLBACK_EVENTS = [
  {
    title:"Hour of Code", slug:"hour-of-code-2022", category:"outreach",
    tagline:"Taking computer science to 500+ school students",
    description:"During December 2022, the NIT Surat ACM Student Chapter celebrated Computer Science Week by conducting the Hour of Code event. ACM executives visited five schools across Surat and Vadodara, collectively educating over 500 school students from grades 8–10. Each school was visited by a group of executives who gave 1-hour talks covering the importance of computer science, HTML and CSS basics, and future opportunities in tech.",
    startDate:"2022-12-05", endDate:"2022-12-07", venue:"5 Schools across Surat & Vadodara",
    isFlagship:false, isUpcoming:false,
    stats:[{label:"Schools Visited",value:"5"},{label:"Students Reached",value:"500+"},{label:"Grades",value:"8–10"}],
    tags:["Outreach","CSWeek","HourOfCode","Schools"],
    achievement:"Special Mention — Best Regional Student Chapter",
    bannerGradient:"linear-gradient(135deg, #064E3B, #059669)", year:2022
  },
  {
    title:"Epiphany 12.1", slug:"epiphany-12-1", category:"competition", edition:"12.1",
    tagline:"National competitive programming, redefined",
    description:"Epiphany is a national-level competitive programming contest conducted at least once every year by ACM NIT Surat. The contest involves a 2–3 hour event where problems are carefully curated by ACM's own problem setters — unique, interesting, and original. Solutions are published post-contest and winners receive monetary rewards.",
    startDate:"2023-01-23", venue:"Online / Codeforces", isOnline:true, isFlagship:true,
    stats:[{label:"Level",value:"National"},{label:"Duration",value:"2–3 Hours"},{label:"Problems",value:"Unique"}],
    tags:["NationalLevel","CompetitiveProgramming","Epiphany","MonetaryRewards"],
    bannerGradient:"linear-gradient(135deg, #1E3A8A, #2563EB)", year:2023
  },
  {
    title:"DotSlash 6.0", slug:"dotslash-6-0", category:"hackathon", edition:"6.0",
    tagline:"30 hours. One mission. Build something that matters.",
    description:"The flagship event of ACM NIT Surat, DotSlash is a 30-hour national-level hackathon organized annually in association with Research Park at SVNIT, Surat. DotSlash is one of the biggest hackathons in Gujarat — teams from all over India register, with 40 selected to compete offline. Teams work for 30 hours straight building innovative solutions. Mentors provide assistance in ideas, inspiration, technical help and critiques. Top 3 winning teams receive monetary rewards.",
    startDate:"2023-02-18", endDate:"2023-02-19", venue:"Research Park, SVNIT Surat",
    isFlagship:true,
    stats:[{label:"Duration",value:"30 Hours"},{label:"Teams",value:"40"},{label:"Level",value:"National"}],
    tags:["Hackathon","Flagship","30Hours","National","Gujarat"],
    achievement:"Flagship Event",
    bannerGradient:"linear-gradient(135deg, #7F1D1D, #DC2626)", year:2023
  },
  {
    title:"CodeWars", slug:"codewars-2023", category:"competition",
    tagline:"Compete at Gujarat's biggest tech fest",
    description:"CodeWars is a programming contest held by ACM NIT Surat in association with MINDBEND — one of the biggest technical fests in Gujarat. The event tests algorithmic thinking, speed, and accuracy under competition conditions.",
    startDate:"2023-03-31", venue:"MINDBEND, SVNIT",
    stats:[{label:"Association",value:"MINDBEND"},{label:"Level",value:"Gujarat"}],
    tags:["CodeWars","MINDBEND","Competition","Gujarat"],
    bannerGradient:"linear-gradient(135deg, #1E3A8A, #4F46E5)", year:2023
  },
  {
    title:"ACM Summer Challenge", slug:"acm-summer-challenge-2023", category:"workshop",
    tagline:"Zero to DSA hero in 30 days",
    description:"The Summer Challenge is a unique endeavor by ACM NIT Surat that teaches young CS enthusiasts the fundamentals of data structures, algorithms, and programming over a 30-day period. No prior experience is required. Problem setters hand-pick, curate and create weekly problems tailored to students' current progress. After each problem set, a problem setter solves them live, teaching the right approach.",
    startDate:"2023-07-08", endDate:"2023-08-10", isOnline:true,
    stats:[{label:"Duration",value:"30 Days"},{label:"Weeks",value:"4"},{label:"Prereqs",value:"None"}],
    tags:["DSA","CPTraining","30Days","Beginners","Online"],
    bannerGradient:"linear-gradient(135deg, #3B0764, #7C3AED)", year:2023, isFlagship:true
  },
  {
    title:"SIH 2023 Ideathon", slug:"sih-2023-ideathon", category:"hackathon",
    tagline:"Shaping SVNIT's best ideas for the nation",
    description:"SIH (Smart India Hackathon) is a national-level hackathon facilitated by the Government of India. To filter the top 30 teams from SVNIT and help them submit their best ideas, ACM NIT Surat, in collaboration with DSC NIT Surat, conducted a faculty mentorship session. Participants presented their ideas to a panel of faculty members who graded them and gave critiques.",
    startDate:"2023-09-16", venue:"SVNIT Campus",
    stats:[{label:"Teams Selected",value:"Top 30"},{label:"Collaboration",value:"DSC NIT Surat"}],
    tags:["SIH2023","SmartIndiaHackathon","GovtOfIndia","Ideathon"],
    bannerGradient:"linear-gradient(135deg, #78350F, #D97706)", year:2023
  },
  {
    title:"Open Source Workshop", slug:"open-source-workshop-2023", category:"workshop",
    tagline:"Git, GitHub, and the open-source way",
    description:"ACM NIT Surat hosted a highly informative workshop on Git, GitHub, and open-source contributions. The workshop drew 57 attendees from second-year students and featured 9 active core committee members. Held in the Old CSE Dept Classroom on 9th October 2023, the 2-hour session provided comprehensive insights into Git commands, GitHub mechanics, and the significance of Hacktoberfest.",
    startDate:"2023-10-09", venue:"Old CSE Dept Classroom, SVNIT",
    stats:[{label:"Attendees",value:"57"},{label:"Duration",value:"2 Hours"},{label:"Members",value:"9"}],
    tags:["Git","GitHub","OpenSource","Hacktoberfest"],
    bannerGradient:"linear-gradient(135deg, #042F2E, #0F766E)", year:2023
  },
  {
    title:"Inception 8.0", slug:"inception-8-0", category:"competition", edition:"8.0",
    tagline:"The college-level CP battle returns",
    description:"On 27th October 2023, ACM NIT Surat conducted the 8th iteration of Inception — the college-level competitive programming contest. The contest took place 1:30 PM–4:30 PM in Lab I and Lab II at the Central Computer Centre (CCC). Students competed in groups of two or three. Both second and third-year students participated, with prize money of ₹3,000 distributed among the three winning teams.",
    startDate:"2023-10-27", venue:"Lab I & II, Central Computer Centre, SVNIT",
    stats:[{label:"Edition",value:"8th"},{label:"Duration",value:"3 Hours"},{label:"Prize",value:"₹3,000"}],
    tags:["Inception","CP","College","TeamContest","CCC"],
    bannerGradient:"linear-gradient(135deg, #1E3A8A, #0066FF)", year:2023
  },
  {
    title:"DotSlash 7.0", slug:"dotslash-7-0", category:"hackathon", edition:"7.0",
    description:"National 30-hour hackathon returns. Bigger problem statements, more teams, higher stakes.",
    startDate:"2024-02-15", isUpcoming: true, year: 2024,
    bannerGradient:"linear-gradient(135deg,#7F1D1D,#DC2626)"
  },
  {
    title:"Epiphany 13.0", slug:"epiphany-13-0", category:"competition", edition:"13.0",
    description:"The next iteration of ACM NIT Surat's national competitive programming contest on Codeforces.",
    startDate:"2024-01-28", isUpcoming: true, year: 2024,
    bannerGradient:"linear-gradient(135deg,#1E3A8A,#2563EB)"
  },
  {
    title:"Inception 9.0", slug:"inception-9-0", category:"competition", edition:"9.0",
    description:"9th edition of the college-level team CP contest. New problems, same intensity.",
    startDate:"2024-10-18", isUpcoming: true, year: 2024,
    bannerGradient:"linear-gradient(135deg,#1E3A8A,#0066FF)"
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Event.deleteMany({});
    console.log('Cleared existing events.');

    await Event.insertMany(FALLBACK_EVENTS);
    console.log('Seeded database with new events.');

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedEvents();
