// Comprehensive History of AI Lesson with rich content and conditional sections
export const conditionalTestLesson = {
  id: 'conditional-test',
  title: 'The Epic Journey of Artificial Intelligence: From Dreams to Reality',
  description: 'Discover the fascinating 80-year journey of AI development, from early visionaries to today\'s ChatGPT revolution',
  estimatedTime: 25,
  xpReward: 200,
  difficulty: 'beginner',
  adaptedContent: {
    content: {
      // Remove all intro content - users don't want to see setup/expectations
    },
    assessment: {
      questions: [
        {
          question: 'Based on what you learned, what was the main limitation of expert systems in the 1970s-80s?',
          options: [
            { text: 'They were too expensive to build', correct: false },
            { text: 'They could only follow pre-programmed rules and couldn\'t learn from new situations', correct: true },
            { text: 'They required too much computer memory', correct: false },
            { text: 'They were too slow to be practical', correct: false }
          ]
        },
        {
          question: 'According to the lesson, what breakthrough in the 2000s enabled modern deep learning?',
          options: [
            { text: 'Faster internet connections', correct: false },
            { text: 'The combination of massive datasets, powerful GPUs, and improved algorithms', correct: true },
            { text: 'Government funding for AI research', correct: false },
            { text: 'The invention of new programming languages', correct: false }
          ]
        },
        {
          question: 'What made ChatGPT\'s release in November 2022 a turning point in AI history?',
          options: [
            { text: 'It was the first AI that could write text', correct: false },
            { text: 'It made powerful AI accessible to everyone through natural conversation', correct: true },
            { text: 'It was the most accurate AI ever created', correct: false },
            { text: 'It could replace all human jobs', correct: false }
          ]
        }
      ]
    }
  },
  slides: [
    // SECTION 1: The Foundation Era (1940s-1980s)
    {
      type: 'concept',
      content: {
        title: 'The Foundation Era: When Machines First Dreamed of Thinking (1940s-1980s)',
        explanation: `Picture this: It's 1950, and a brilliant British mathematician named Alan Turing poses a simple yet profound question: "Can machines think?" This question would spark an 80-year journey that continues to reshape our world today.

The story begins in the shadow of World War II. Alan Turing, fresh from his success breaking the German Enigma code, wasn't content with just building calculating machines. He envisioned something far more ambitious: machines that could exhibit intelligent behavior indistinguishable from humans.

**The Turing Test: A Revolutionary Idea**

In 1950, Turing published a paper that would become legendary: "Computing Machinery and Intelligence." Instead of getting bogged down in philosophical debates about whether machines could truly "think," Turing proposed a practical test. If a human interrogator couldn't tell whether they were conversing with a human or a machine through written responses, then the machine had demonstrated intelligence.

This wasn't just academic theory. Turing was laying the groundwork for a new field of science. He predicted that by the year 2000, machines would be able to fool 30% of human judges for at least 5 minutes. (Spoiler alert: it took longer than he thought, but the vision was spot-on.)

**The Dartmouth Dreams: AI is Born**

Fast forward to the summer of 1956. A group of brilliant researchers gathered at Dartmouth College for what would become known as the "Dartmouth Workshop." John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon spent ten weeks exploring a radical idea: could human intelligence be so precisely described that a machine could simulate it?

It was here that John McCarthy coined the term "Artificial Intelligence." These weren't just dreamers—they were serious scientists with concrete goals. They believed that "every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it."

**The Golden Age: When Computers Learned to Play and Diagnose**

The 1960s and 70s brought the first taste of AI success. Computers began beating humans at games like checkers and chess. But the real breakthroughs came in practical applications.

Enter MYCIN, developed at Stanford in the 1970s. This expert system could diagnose bacterial infections and recommend treatments with accuracy that rivaled human doctors. MYCIN worked by encoding the knowledge of medical experts into thousands of "if-then" rules. If the patient has a fever AND shows certain symptoms AND test results indicate specific bacteria, THEN recommend this antibiotic.

DENDRAL, another Stanford creation, could identify the molecular structure of organic compounds better than human chemists. These systems proved that computers could handle complex, real-world problems requiring expertise.

**The Promise and the Problem**

By the late 1970s, AI seemed unstoppable. Companies were investing millions in expert systems. Researchers confidently predicted that human-level AI was just around the corner—maybe 10 or 20 years away.

But there was a fundamental problem hiding beneath the success. These early AI systems were like incredibly sophisticated filing cabinets. They could store and retrieve vast amounts of expert knowledge, but they couldn't learn anything new. If a situation arose that wasn't covered by their pre-programmed rules, they failed completely.

Imagine a chess program that could play grandmaster-level chess but couldn't learn from its losses or adapt to new strategies. That was the state of AI in the 1980s—powerful within narrow domains, but brittle and unable to grow.

**The First AI Winter**

By the mid-1980s, the limitations became impossible to ignore. The promised breakthroughs hadn't materialized. Human-level AI remained elusive. Funding dried up, companies abandoned AI projects, and the field entered what researchers call the "AI Winter"—a period of reduced interest and investment that lasted nearly a decade.

But this winter wasn't the end of the story. It was a necessary pause, allowing researchers to develop new approaches that would eventually lead to the AI revolution we're experiencing today. Sometimes, the most important progress happens not in moments of triumph, but in moments of reflection and reimagining.`,
        keyPoints: [
          'Alan Turing\'s 1950 paper established the foundation for AI with the famous Turing Test',
          'The 1956 Dartmouth Workshop officially launched AI as a field of study',
          'Early expert systems like MYCIN and DENDRAL showed AI could match human expertise in narrow domains',
          'The first "AI Winter" in the 1980s revealed the limitations of rule-based systems that couldn\'t learn or adapt'
        ]
      }
    },
    {
      type: 'fill-blank',
      content: {
        text: 'Alan Turing proposed that if a human interrogator couldn\'t tell whether they were conversing with a _______ or a machine through written responses, then the machine had demonstrated _______.',
        correctAnswers: ['human', 'intelligence'],
        instructions: 'Fill in the blanks based on what you just learned about the Turing Test. Think about what Turing was comparing and what he was trying to measure.'
      }
    },
    
    // SECTION 2: The Learning Revolution (1990s-2010s)
    {
      type: 'concept', 
      content: {
        title: 'The Learning Revolution: When Machines Discovered How to Improve (1990s-2010s)',
        explanation: `As the 1990s dawned, AI researchers faced a fundamental question: How do you build a machine that can learn and adapt, rather than just follow pre-programmed rules? The answer would come from an unexpected source—studying how the human brain actually works.

**The Neural Renaissance**

The concept of artificial neural networks wasn't new. In fact, researchers had been experimenting with brain-inspired computing since the 1940s. But it took decades for computer power to catch up with the vision.

Neural networks work on a beautifully simple principle inspired by how neurons in our brains connect and communicate. Imagine thousands of simple processing units (artificial neurons) connected in complex networks. Each connection has a "weight" that determines how much influence one neuron has on another. When the network encounters new information, it adjusts these weights, gradually learning patterns and improving its performance.

The breakthrough came when researchers realized they could train these networks on massive amounts of data. Instead of programming explicit rules, they could show the network thousands of examples and let it discover the patterns on its own.

**The Internet Changes Everything**

The explosion of the internet in the 1990s created something AI researchers had never had before: virtually unlimited training data. Suddenly, computers had access to millions of emails (perfect for learning spam detection), thousands of web pages (ideal for search algorithms), and countless images (essential for visual recognition).

Google, founded in 1998, became the perfect example of this new approach. Instead of trying to manually categorize every website, Google's PageRank algorithm learned to identify high-quality pages by analyzing the complex web of links between sites. The more data it processed, the better it became.

**Machine Learning Goes Mainstream**

By the 2000s, machine learning was everywhere, even if most people didn't realize it. When Amazon recommended products you might like, when your email filtered out spam, when Google translated text between languages—these were all early AI systems learning from vast amounts of data.

Netflix's recommendation system became legendary. By analyzing the viewing patterns of millions of users, it could predict with startling accuracy what shows you'd enjoy. The system didn't need to understand why people liked certain shows—it just needed to recognize patterns in viewing behavior.

**The Deep Learning Breakthrough**

The real game-changer came in the late 2000s and early 2010s with the rise of "deep learning." Researchers discovered that neural networks with many layers (hence "deep") could learn incredibly sophisticated patterns.

In 2012, a deep learning system called AlexNet shocked the computer vision world by winning the ImageNet competition—a contest to correctly identify objects in photos—by a massive margin. For the first time, computers could recognize images with accuracy approaching human levels.

But AlexNet's success required three crucial ingredients that had finally come together:

1. **Massive datasets**: ImageNet contained over 14 million labeled images
2. **Powerful processors**: Graphics Processing Units (GPUs), originally designed for video games, turned out to be perfect for training neural networks
3. **Algorithmic improvements**: New techniques made it possible to train much deeper, more complex networks

**The Mobile Revolution Accelerates AI**

The smartphone revolution created an unexpected boost for AI development. Suddenly, billions of people were carrying powerful computers with cameras, microphones, and internet connections. Every photo uploaded, every voice command, every search query became training data for AI systems.

Apple's Siri, launched in 2011, brought voice AI to millions of users. While still limited compared to today's standards, Siri demonstrated that AI could be useful in everyday life. Google's voice search, image recognition, and translation services began improving rapidly as they processed data from millions of mobile users.

**Games as AI Proving Grounds**

Games became the ultimate testing ground for AI capabilities. In 1997, IBM's Deep Blue defeated world chess champion Garry Kasparov—a symbolic moment showing computers could outthink humans in strategic domains.

But the real breakthrough came in 2016 when Google's AlphaGo defeated Lee Sedol, one of the world's best Go players. Go is exponentially more complex than chess, with more possible positions than there are atoms in the observable universe. AlphaGo's victory wasn't just about raw computational power—it demonstrated intuition, creativity, and the ability to make strategic decisions in uncertain situations.

**The Stage is Set**

By 2020, all the pieces were in place for the AI revolution we're experiencing today. Researchers had cracked the code on how to build systems that could learn from massive amounts of data. The internet provided that data in abundance. Cloud computing made powerful AI accessible to any developer. And a new approach called "transformer architecture" was about to change everything.

The stage was set for November 2022, when a little-known research lab called OpenAI would release ChatGPT and transform AI from a tool used by tech experts into a conversational partner available to anyone with an internet connection.`,
        keyPoints: [
          'Neural networks learned to recognize patterns from massive datasets rather than following pre-programmed rules',
          'The internet explosion provided unlimited training data that AI systems needed to improve',
          'Deep learning breakthrough in 2012 with AlexNet showed computers could match human visual recognition',
          'Mobile devices accelerated AI development by creating billions of data sources and real-world testing environments',
          'Game victories like AlphaGo defeating world champion demonstrated AI could handle complex strategic thinking'
        ]
      }
    },
    {
      type: 'fill-blank',
      content: {
        text: 'The deep learning breakthrough required three crucial ingredients: massive _______, powerful _______ originally designed for video games, and improved _______ for training complex networks.',
        correctAnswers: ['datasets', 'GPUs', 'algorithms'],
        instructions: 'Think about what made deep learning possible in the 2010s. What three things finally came together to enable the breakthrough?'
      }
    },

    // SECTION 3: The Intelligence Explosion (2010s-Present)
    {
      type: 'concept',
      content: {
        title: 'The Intelligence Explosion: When AI Became Conversational (2010s-Present)',
        explanation: `November 30, 2022, will be remembered as one of the most significant dates in human history. On that day, OpenAI released ChatGPT to the public, and within just five days, over one million people had tried it. Within two months, it reached 100 million users—the fastest adoption of any technology in human history.

But ChatGPT's overnight success was actually decades in the making. Let's explore how we arrived at this pivotal moment and what it means for our future.

**The Transformer Revolution**

The story begins in 2017 with a research paper titled "Attention Is All You Need." Google researchers introduced something called the "transformer architecture"—a new way of building AI systems that could understand and generate human language.

Previous AI systems processed text sequentially, like reading a book word by word. Transformers were different. They could look at all the words in a sentence simultaneously and understand how each word related to every other word. This "attention mechanism" allowed them to grasp context, nuance, and meaning in ways no previous AI could match.

Think about the sentence: "The bank can guarantee deposits will eventually cover future tuition costs because it has a very large fund." A transformer understands that "bank" refers to a financial institution (not a river bank), "it" refers back to "bank," and "deposits" relates to money (not sediment). This contextual understanding was revolutionary.

**The Scale Revolution**

But transformers alone weren't enough. The real breakthrough came when researchers realized that making these models larger—much larger—led to unexpected capabilities emerging naturally.

GPT-1, released in 2018, had 117 million parameters (the internal settings that determine the model's behavior). GPT-2, released in 2019, jumped to 1.5 billion parameters. GPT-3, released in 2020, exploded to 175 billion parameters.

With each increase in scale, something magical happened. The models didn't just get better at their training tasks—they developed entirely new capabilities that nobody had specifically programmed. GPT-3 could write poetry, solve math problems, code in multiple programming languages, and engage in sophisticated reasoning.

This phenomenon, called "emergence," is one of the most fascinating aspects of modern AI. Just as wetness emerges from H2O molecules or consciousness emerges from neural activity, complex behaviors emerge from the interaction of billions of simple computational elements.

**The ChatGPT Moment**

When OpenAI released ChatGPT, they added one crucial innovation to GPT-3.5: conversational training. Using a technique called "Reinforcement Learning from Human Feedback" (RLHF), they taught the model to be helpful, harmless, and honest in conversations.

Human trainers engaged in conversations with the AI, rating responses and providing feedback. The system learned not just what information to provide, but how to communicate it clearly, when to admit uncertainty, and how to be genuinely helpful rather than just technically correct.

The result was transformative. For the first time, interacting with AI felt natural. You could ask questions in plain English and get thoughtful, nuanced responses. You could have back-and-forth conversations, ask for clarifications, and even request information in specific formats or styles.

**The Democratization of AI**

ChatGPT's success triggered an unprecedented wave of innovation. Microsoft integrated AI into Office and Bing search. Google rushed to release Bard. Anthropic launched Claude. Dozens of startups emerged, each pushing the boundaries of what AI could do.

But the real revolution was democratization. Suddenly, you didn't need a computer science degree to use powerful AI. A teacher could generate lesson plans, a small business owner could write marketing copy, a student could get tutoring help, and a creative writer could overcome writer's block—all through simple conversation.

**Beyond Text: The Multimodal Future**

Today's AI systems are rapidly expanding beyond text. GPT-4 can analyze images and describe what it sees. DALL-E can create stunning artwork from text descriptions. AI systems can generate realistic videos, compose music, and even control robots.

We're entering an era of "multimodal AI"—systems that can seamlessly work with text, images, audio, and video. Imagine describing a product idea in words and having AI generate the design, create marketing materials, write the business plan, and even produce a demo video.

**The Current Landscape**

As of 2024, we're in the midst of what many experts call the "Cambrian explosion" of AI—a period of rapid diversification and capability growth reminiscent of the biological Cambrian period when complex life forms first appeared.

Major tech companies are racing to build more powerful models. GPT-4, Claude-3, and Gemini represent the current state of the art, but each new release brings capabilities that seemed impossible just months before.

**Looking Forward: The Next Frontier**

We're still in the early stages of the AI revolution. Current AI systems are like the personal computers of the 1980s—powerful but still requiring significant expertise to use effectively. The next phase will likely bring AI agents that can complete complex, multi-step tasks autonomously.

Imagine an AI assistant that could book your entire vacation—researching destinations, comparing flights, making reservations, creating itineraries, and even learning your preferences to make better suggestions for future trips. Or an AI tutor that adapts in real-time to your learning style, identifies knowledge gaps, and creates personalized educational content.

**The Philosophical Questions**

As AI capabilities continue to expand, we're grappling with profound questions that previous generations never had to consider. What happens when AI can perform most cognitive tasks better than humans? How do we ensure AI systems remain aligned with human values? What new forms of creativity and collaboration become possible when humans and AI work together?

The history of AI teaches us that the future rarely unfolds exactly as predicted. The pioneers of the 1950s couldn't have imagined smartphones or social media, just as we likely can't imagine the specific ways AI will transform society in the coming decades.

What we do know is that we're living through one of the most significant technological revolutions in human history. Understanding this history helps us appreciate not just how far we've come, but how much further we might go.`,
        keyPoints: [
          'The transformer architecture in 2017 enabled AI to understand language context and relationships between words',
          'Scale revolution showed that larger AI models develop unexpected "emergent" capabilities naturally',
          'ChatGPT\'s November 2022 release democratized AI by making it accessible through natural conversation',
          'We\'re currently in a "Cambrian explosion" of AI with rapid development across text, images, audio, and video',
          'Future AI agents will likely handle complex, multi-step tasks autonomously while raising important ethical questions'
        ]
      }
    },
    {
      type: 'fill-blank',
      content: {
        text: 'ChatGPT reached _______ million users in just two months, making it the _______ adoption of any technology in human history. This was possible because it made AI accessible through natural _______.',
        correctAnswers: ['100', 'fastest', 'conversation'],
        instructions: 'Based on the reading, what milestone did ChatGPT achieve and what made it so revolutionary for ordinary users?'
      }
    }
  ]
};

export default conditionalTestLesson; 