require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const blogs = [
  {
    title: 'Understanding Probabilistic Analysis & Randomized Algorithms',
    slug: 'understanding-probabilistic-analysis-randomized-algorithms',
    number: '01',
    excerpt: 'How do you estimate running time when inputs are unpredictable? Explore indicator random variables, the Hire-Assistant problem, and the beautiful O(log n) expected result.',
    category: 'algorithms',
    featured: true,
    published: true,
    readTime: 7,
    author: {
      name: 'Bhavya Hirani',
      avatar: 'BH',
      role: 'Core Team'
    },
    publishedAt: new Date('2023-08-13'),
    content: `
    <div class="ao-quote">
      <p>"I guess it comes down to a simple choice really: Get busy living, or get busy dying."</p>
      <cite>— Andy Dufresne, Shawshank Redemption</cite>
    </div>
    <p>Let us consider a man called <strong>Boris</strong> who has an algorithm. To determine its practicality, Boris might want to estimate its run time. This is standard practice — people in Computer Science always want to figure out if their algorithm is actually "good".</p>
    <p>Usually, it is rather simple to determine how many times a certain statement is executed. However, there might be operations that run only if a certain condition is met — and if that operation has a very high cost, the running time majorly depends on its frequency. But we can't know the input in advance. Which begs the question: <strong>how might I predict the outcome when the inputs themselves are unpredictable?</strong></p>

    <h2>Probabilistic Analysis</h2>
    <p>One way is to average the running time over all possible inputs — the average-case running time. But summing and dividing by n is just a special case of taking the <strong>expected value</strong> — when we have a uniform distribution.</p>
    <p>Probabilistic analysis takes the input distribution into account and estimates running time (or total cost) using probabilities.</p>
    <div class="highlight-box"><p>Consider the <strong>HIRE_ASSISTANT problem</strong>: Given a list of candidates (by rank), after each interview we hire any candidate better than the current one. Hiring cost Ch is very high — we want to estimate total hiring operations.</p></div>
    <p>There's no way to know this frequency directly — we may hire no one (decreasing order), hire everyone (increasing order), or something in between. Let's use probabilities.</p>
    <p>Assume the order of candidates is completely random — a uniform distribution. Then:</p>
    <code class="math-line">E[running time] = E[number of hires] × (cost of one hire)</code>
    <p>In the first i candidates, any one could be the most qualified. So the probability candidate i gets selected is:</p>
    <code class="math-line">P(candidate i is hired) = 1/i</code>
    <p>Instead of computing directly, we use <strong>indicator random variables</strong>:</p>
    <code class="math-line">Let Xᵢ = 1 if candidate i is selected, 0 otherwise</code>
    <code class="math-line">X = X₁ + X₂ + ... + Xₙ</code>
    <code class="math-line">E[X] = Σ E[Xᵢ] = Σ (1/i)  for i = 1 to n</code>
    <p>Breaking this harmonic series into log(n) parts gives an upper bound:</p>
    <code class="math-line">E[X] ≤ ln(n) + 1  →  O(log n)</code>
    <p>Hence, if inputs are already in a uniform distribution, the average-case running time of HIRE_ASSISTANT is <strong>O(log n)</strong>.</p>

    <h2>Randomized Algorithms</h2>
    <p>Did you spot an issue? We assumed a uniform distribution — but what if the input follows a gamma distribution? Our O(log n) analysis breaks down entirely.</p>
    <p>So Boris thought: if I don't know what the distribution is, I'll <strong>impose one on the input</strong>. That's exactly what randomized algorithms do — they randomize the input before processing, converting any distribution into a uniform one.</p>
    <div class="highlight-box"><p>Analogy: asking the pool of candidates to play a tournament of rock-paper-scissors to decide who interviews next. The order is now guaranteed to be random, regardless of how they arrived.</p></div>
    <ul>
      <li><strong>Average-case running time</strong> — assumes the input is already in a uniform distribution.</li>
      <li><strong>Expected running time</strong> — associated with an algorithm that imposes a distribution itself before processing.</li>
    </ul>
    <p>Both are calculated similarly using probabilistic analysis — the key difference is whether the distribution is assumed or enforced. We use different terms to make this distinction explicit and preserve clarity about the algorithm's nature.</p>
    <p>Ultimately, the agenda is this: be sure that most times your program runs, the running time matches your analysis — and that requires being sure about the input distribution. Randomized algorithms give you that certainty.</p>
    <div class="ao-read-more">
      <span style="font-family:var(--font-mono);font-size:.58rem;letter-spacing:.2em;color:var(--w20);text-transform:uppercase">Reference: Introduction to Algorithms — CLRS</span>
      <a href="#">Full Chapter ↗</a>
    </div>
    `
  },
  {
    title: 'First Step Towards Research',
    slug: 'first-step-towards-research',
    number: '02',
    excerpt: 'Wading through the opaque process of landing a research internship in India. Cold emails, IIT professors, and the honest path from confusion to a 9-month IIT Bombay internship.',
    category: 'career',
    featured: false,
    published: true,
    readTime: 9,
    author: {
      name: 'Bhavya Hirani',
      avatar: 'BH',
      role: 'Core Team'
    },
    publishedAt: new Date('2023-01-01'),
    content: `
    <div class="ao-quote">
      <p>"Without commitment you will never start, but more importantly, without consistency you will never finish."</p>
      <cite>— Denzel Washington</cite>
    </div>
    <p>Here, by research, I mean a master's degree. My goals for the next few years: get a master's from a US university, then work in the industry on something impactful. I've always felt an air of confusion about doing research as a student in India — like wading through swampy ground flooded with opaque water.</p>
    <p>I couldn't find many people in my age group who had done hardcore research, so the technicalities were always fuzzy. But I'm still grateful to have met some beautiful people along the way — seniors and professors — whose words gave me the courage to persist.</p>
    <p>Through whatever it was that I did, I ended up with <strong>two kind professors from IIT Bombay</strong> who believed I was competent enough for a 9-month internship. This was the first tangible outcome of my efforts. I thought: I can't claim my methods are the "best" — but I worked really hard, and I must have done something right to gain a professor's trust.</p>

    <h2>Whom to Ask for Help</h2>
    <p>Seniors and friends can be helpful, but <strong>professors can be more so</strong>. There is absolutely no reason not to ask them — and from what I've observed, professors genuinely want to help passionate students. If you were a professor, wouldn't you want to help someone who is seriously looking to improve?</p>

    <h2>How Much Work, What Kind of Work?</h2>
    <p>Professors don't need savants. They appreciate students who have, before reaching out, already gone through the pain to learn or attempt something <strong>HARD</strong> on their own — something most people won't even try. That patience and effort shows you're not just another person.</p>
    <div class="highlight-box"><p>You need something that separates yourself from the crowd — and that can be done with <strong>a month or two of consistent effort</strong> if getting an internship is urgent. If you have time, spend most of it studying, reading, and gaining knowledge.</p></div>
    <ul>
      <li>Pick a domain you're genuinely interested in — effort becomes joy, not a drag.</li>
      <li>Commit 100% to the domain you've picked. For me, this was compiler design. A lack of commitment causes confusion, anxiety, and stunted productivity.</li>
      <li>Check websites of reputed universities and find professors whose research interests align with yours.</li>
      <li>Look for professors who explicitly mention undergraduate internships — these are goldmines. They tell you exactly what prerequisites matter.</li>
      <li>Find resources for fulfilling those prerequisites and note the professor's details.</li>
    </ul>
    <p>Pick a well-reputed textbook. Ultimately books become almost necessary. Simply watching videos is a shortcut — you can't efficiently cross-reference them, and they lack rigour. Also: don't try to understand the text 100% in the first read. Mark what you don't understand and move on. You'll understand it better when you apply it.</p>

    <h2>Writing Cold Emails</h2>
    <p>Instead of sending hundreds of generic emails (which greatly reduce your chances), I aimed for a few very high-quality "warm" emails tailored to specific professors.</p>
    <p>If your email simply states that you want to work with them, there is nothing in it that separates you from the crowd. A two-liner with something cliché shows zero commitment. And zero is not what we want.</p>
    <p>Include the following in your email:</p>
    <ul>
      <li>A list of concrete steps you've already taken to fulfill any prerequisites. Make it clear you've done your homework.</li>
      <li>Frame your message according to the exact bullet points mentioned on the professor's website (if they listed prerequisites).</li>
      <li>Clearly state the time you can commit. Best case: you're willing to work for as long as it takes to do impactful work.</li>
      <li>Do you have accommodation near campus? Mention it — if the internship isn't through a program, the professor may not provide housing.</li>
      <li>Explain why you're an asset, not a liability. The professor guides you; in return, you help their research.</li>
      <li>Ask one or two genuine questions about their research domain or a paper you've read. Show curiosity.</li>
      <li>Be honest. "I found your research very interesting" without a follow-up question means nothing. I wrote: <strong>"While I haven't gotten to a point where I completely understand it, I'm consistently trying to make my way through it."</strong> A little honesty beats a generic statement.</li>
      <li>Address them as "Dear Dr. [Last Name]" — not "Dear sir". Show them from the first line that this email is meant for them.</li>
    </ul>

    <h2>Who Cares About Luck</h2>
    <p>What if the professor doesn't see your email? Fretting over it is futile. <strong>You don't need to control your luck.</strong> You just need to ensure: if the person at the other end reads your email, there is no chance in hell they'll ignore it. Because people respect hard work and commitment.</p>
    <p>Even in the worst case — rejection — they should feel obligated to respond explicitly rather than just not reply. That is the standard you're aiming for. This is why you must show promise and separate yourself from the crowd.</p>
    <div class="ao-read-more">
      <span style="font-family:var(--font-mono);font-size:.58rem;letter-spacing:.2em;color:var(--w20);text-transform:uppercase">Written by Bhavya Hirani · ACM NIT Surat</span>
      <a href="#">Share Article ↗</a>
    </div>
    `
  }
];

const seedBlogs = async () => {
  await connectDB();
  try {
    await Blog.deleteMany();
    await Blog.insertMany(blogs);
    console.log('Blogs Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedBlogs();
