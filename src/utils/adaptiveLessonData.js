import { serverTimestamp } from 'firebase/firestore';
import { conditionalTestLesson } from './testConditionalLesson';

/**
 * Complete Adaptive Lesson System for Prompt Engineering Mastery
 * Transforms content based on user skill level (beginner/intermediate/advanced)
 */

export const promptEngineeringMasteryPath = {
  id: 'prompt-engineering-mastery',
  title: 'Prompt Engineering Mastery',
  description: 'Master the art of communicating with AI - from complete beginner to expert',
  category: 'Core Skills',
  difficulty: 'Adaptive',
  estimatedHours: 8,
  totalLessons: 10,
  icon: '🎯',
  color: 'from-blue-500 to-purple-600',
  isRecommended: true,
  isFlagship: true,
  prerequisites: [],
  nextPaths: ['ai-for-business', 'ai-for-content-creation', 'ai-workflow-automation'],
  targetAudience: ['complete-beginner', 'some-exposure', 'regular-user', 'power-user'],
  published: true,
  isPremium: false,
  version: 1,
  order: 1
};

export const vibeCodePath = {
  id: 'vibe-coding',
  title: 'Vibe Coding',
  description: 'Learn creative coding by describing what you want and letting AI build it for you',
  category: 'Creative Skills',
  difficulty: 'Beginner to Intermediate', 
  estimatedHours: 3,
  totalLessons: 4,
  icon: '🎮',
  color: 'from-purple-500 to-pink-600',
  isRecommended: true,
  isFlagship: false,
  prerequisites: ['prompt-engineering-mastery'],
  nextPaths: ['ai-for-content-creation'],
  targetAudience: ['creative-beginners', 'game-enthusiasts', 'educators'],
  published: true,
  isPremium: true, // Premium learning path
  version: 1,
  order: 3
};

export const adaptiveModules = {
  'prompt-engineering-mastery': [
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Understanding what AI is and how it works',
      order: 1
    },
    {
      id: 'prompting-skills',
      title: 'Core Prompting Skills',
      description: 'Learn to write effective prompts',
      order: 2
    },
    {
      id: 'creative-applications',
      title: 'Creative AI Applications',
      description: 'Use AI for images, video, and voice',
      order: 3
    },
    {
      id: 'practical-applications',
      title: 'Real-World Applications',
      description: 'Apply AI to daily life and work',
      order: 4
    }
  ],
  'vibe-coding': [
    {
      id: 'interactive-coding',
      title: 'Interactive Coding',
      description: 'Learn to create interactive content through AI-assisted coding',
      order: 1
    }
  ]
};

export const adaptiveLessons = {
  'ai-foundations': [
    // LESSON 1: Welcome to the AI Revolution
    {
      id: 'welcome-ai-revolution',
      title: 'AI History: How We Got Here & Where We\'re Going',
      lessonType: 'concept_explanation_with_interaction',
      order: 1,
      
      coreConcept: "Artificial Intelligence (AI) is transforming the world around us. It's not just about chatbots—it's about machines that can understand, generate, or act on information using patterns learned from massive data.",
      
      content: {
        free: {
          introduction: "From wartime codebreakers to ChatGPT - discover the incredible 75-year journey that brought AI from science fiction to your pocket. This is the true story of artificial intelligence, told like the fascinating history it is.",
          
          mainContent: {
            // Section 1: The Wartime Origins and Early Dreams (1940s-1980s)
            foundationEra: {
              title: "The Codebreaker Who Started It All",
              content: `**It's 1943, and the fate of World War II hangs in the balance.**

At a secret facility called Bletchley Park in England, a brilliant mathematician named Alan Turing is working around the clock to crack Nazi communication codes. Every decoded message could save thousands of Allied lives. But Turing isn't just building calculating machines—he's dreaming of something far more extraordinary.

**The Question That Changed Everything**

Seven years later, in 1950, Turing published a paper that would revolutionize human thinking. Instead of asking the impossible-to-answer question "Can machines think?", he proposed something practical: What if we couldn't tell the difference between talking to a human and talking to a machine?

Imagine sitting at a computer terminal in 1950, typing questions to someone—or something—in another room. If you couldn't figure out whether you were chatting with a person or a machine, then that machine had achieved something remarkable. Turing called this the "Imitation Game," though we know it today as the Turing Test.

This wasn't just academic philosophy. Turing was essentially saying: "Forget about whether machines can think like us. Let's focus on whether they can convince us they're thinking." It was a genius way to sidestep endless philosophical debates and focus on measurable results.

**The Summer That Launched a Revolution**

Fast forward to the summer of 1956. Picture Dartmouth College in New Hampshire—ivy-covered buildings, warm summer evenings, and a group of the world's smartest researchers gathered for what they thought would be a quiet academic workshop.

John McCarthy, a young mathematician, had convinced his colleagues to spend ten weeks exploring a wild idea: What if human intelligence could be described so precisely that a machine could replicate it? They called their field "Artificial Intelligence"—a term McCarthy coined that summer.

These weren't sci-fi dreamers. They were serious scientists who genuinely believed they could crack the code of human intelligence within a generation. Their proposal was breathtakingly ambitious: "We think that a significant advance can be made in one or more of these problems if a carefully selected group of scientists work on it together for a summer."

**The Golden Age: When Computers Became Doctors**

The 1960s and 70s were like the Wild West of AI. Anything seemed possible, and researchers were making breakthroughs that felt like magic to ordinary people.

At Stanford University, a team created something called MYCIN that could diagnose blood infections as accurately as the best human doctors. Imagine walking into a hospital in 1976 and being told that a computer—not just a doctor—would help diagnose your illness. MYCIN worked by encoding thousands of medical rules: "If the patient has a fever AND their white blood cell count is elevated AND the bacteria shows certain characteristics, THEN recommend this specific antibiotic."

Meanwhile, another Stanford system called DENDRAL was identifying the molecular structure of unknown chemical compounds better than experienced chemists. These "expert systems" were like having the world's best specialists available 24/7, never getting tired, never forgetting crucial details.

**The Reality Check**

But there was a catch—a big one that would bring this golden age crashing down.

These early AI systems were like incredibly sophisticated recipe books. They could follow complex instructions perfectly, but they couldn't learn from their mistakes or adapt to new situations. If MYCIN encountered a disease it hadn't been specifically programmed to recognize, it was helpless.

Think about it like this: Imagine a chess grandmaster who could play brilliantly but couldn't learn from losses or adapt to new strategies. That's exactly what 1980s AI was like—impressive within narrow boundaries, but brittle and unchanging.

**The Great AI Winter**

By the mid-1980s, the honeymoon was over. Companies had spent millions on AI systems that worked well in laboratories but failed in the messy real world. The promised breakthroughs—computers that could think like humans—remained stubbornly out of reach.

Funding dried up. AI researchers couldn't get jobs. The field entered what historians call the "AI Winter"—a period of disillusionment that lasted nearly a decade. Magazine covers that had once proclaimed the coming age of thinking machines now ran stories about AI's broken promises.

But this winter wasn't the end of the story. Like a forest fire that clears the underbrush for new growth, the AI Winter forced researchers to completely rethink their approach. The next wave of AI wouldn't try to replicate human reasoning—it would do something even more powerful: learn from experience.`
            },
            
            // Section 2: The Internet Era and Machine Learning Revolution (1990s-2020s)
            internetEra: {
              title: "When the Internet Changed Everything",
              content: `**The 1990s arrived with a completely different world.**

The Berlin Wall had fallen, the Soviet Union had collapsed, and something called the "World Wide Web" was connecting computers across the globe. But perhaps most importantly for AI, researchers were about to discover something that would change everything: machines could learn.

**Looking to the Brain for Inspiration**

Remember those AI systems from the 1980s that were like sophisticated filing cabinets? Researchers began wondering: What if we built AI more like the human brain instead?

Your brain contains roughly 86 billion neurons, each connected to thousands of others. When you learn something new—like recognizing your friend's face or remembering where you parked your car—your brain doesn't follow pre-programmed rules. Instead, it adjusts the strength of connections between neurons based on experience.

Scientists decided to try something similar with computers. They created "artificial neural networks"—systems with thousands of simple processing units connected like brain cells. When these networks encountered new information, they could adjust their connections and gradually learn patterns.

The breakthrough wasn't just theoretical. Unlike the expert systems of the 1980s, these neural networks could improve from experience. Show them thousands of examples, and they'd start recognizing patterns that even their creators hadn't anticipated.

**The Internet Gold Rush**

Then came the internet explosion of the late 1990s, and suddenly AI researchers had something they'd never possessed before: unlimited training data.

Think about what the internet meant for machine learning. Every email that passed through servers could teach AI systems about language and communication. Every website that got linked to could help AI understand what information people found valuable. Every search query could reveal what humans were actually looking for.

Larry Page and Sergey Brin, two Stanford graduate students, perfectly captured this new approach when they founded Google in 1998. Instead of hiring teams of librarians to manually categorize every website on the internet, they created an algorithm that learned to identify high-quality pages by analyzing the web of links between them.

Google's PageRank algorithm was revolutionary because it got smarter with more data. The more websites it analyzed, the better it became at understanding which pages were truly useful. It was like having a librarian who became more knowledgeable with every book they catalogued.

**AI in Your Daily Life (Even When You Didn't Know It)**

By the early 2000s, machine learning was quietly infiltrating your daily routine, even though most people had never heard the term.

When you checked your email and found that spam messages had been automatically filtered to your junk folder—that was AI. When you shopped on Amazon and saw products recommended "based on your browsing history"—that was AI learning your preferences. When Google Translate helped you understand a website in another language—that was AI trained on millions of multilingual documents.

Netflix became the poster child for this new approach. By 2010, the company was analyzing the viewing patterns of millions of subscribers to predict what shows you'd enjoy. The system didn't need to understand why you liked "The Office" or "Breaking Bad"—it just needed to recognize that people with similar viewing histories often enjoyed similar content.

**The Smartphone Revolution**

Then Steve Jobs walked onto a stage in San Francisco in January 2007 and changed everything again. The iPhone wasn't just a phone—it was a computer with a camera, microphone, and internet connection that millions of people would carry everywhere.

Suddenly, AI companies had access to unprecedented amounts of real-world data. Every photo uploaded to Facebook could help computers learn to recognize images. Every voice command to Apple's Siri (launched in 2011) could improve speech recognition. Every GPS navigation request could teach AI about traffic patterns and optimal routes.

Your smartphone became a data-generating machine that made AI systems smarter every single day.

**The Deep Learning Breakthrough**

The real game-changer came in 2012 with a moment that AI researchers still talk about with reverence.

A team led by Geoffrey Hinton at the University of Toronto created a neural network called AlexNet that could identify objects in photographs with stunning accuracy. In that year's ImageNet competition—essentially the World Cup of image recognition—AlexNet didn't just win; it obliterated the competition by a margin that shocked even the researchers who built it.

For the first time in history, a computer could look at a photo and identify what was in it almost as well as a human could. But AlexNet's success required three things to come together at exactly the right moment:

First, they had massive datasets. ImageNet contained over 14 million labeled photographs—from "golden retriever" to "fire truck" to "espresso." No previous generation had access to training data at this scale.

Second, they had powerful processors. Graphics Processing Units (GPUs), originally designed to render video game graphics, turned out to be perfect for training neural networks. Gamers had unknowingly funded the hardware that would power the AI revolution.

Third, they had algorithmic breakthroughs that allowed them to train much deeper, more complex networks than ever before. These "deep learning" systems could discover increasingly sophisticated patterns in data.

**Games Become AI's Proving Ground**

While AlexNet was revolutionizing image recognition, AI was also conquering games that had long been considered uniquely human domains.

In 1997, IBM's Deep Blue had defeated chess world champion Garry Kasparov in a match watched by millions. But chess, despite its complexity, followed clear rules and had a finite number of possible moves.

Go was different. This ancient Asian board game has more possible positions than there are atoms in the observable universe. Professional Go players talk about "intuition" and "reading the flow of the game"—concepts that seemed impossible to program into a computer.

So when Google's AlphaGo defeated Lee Sedol, one of the world's best Go players, in March 2016, it wasn't just another victory. It was proof that AI could handle intuition, creativity, and strategic thinking in ways that even experts hadn't thought possible.

The matches were broadcast live, and millions of people watched as AlphaGo made moves that initially confused even professional commentators—only to reveal their brilliance several moves later. It was like watching an alien intelligence at work.

**Setting the Stage for Revolution**

By 2020, all the pieces were finally in place for the AI revolution you're living through today.

Researchers had figured out how to build systems that could learn from massive amounts of data. The internet provided that data in abundance. Cloud computing made powerful AI accessible to any programmer with a credit card. And smartphone users had unknowingly created the largest training dataset in human history.

The stage was set for November 2022, when a small research lab in San Francisco would release a chatbot that would make AI accessible to every person on the planet.`
            },
            
            // Section 3: The ChatGPT Revolution and What's Next
            chatgptRevolution: {
              title: "The Day AI Became Everyone's Assistant",
              content: `**November 30, 2022, started like any other Wednesday.**

Most people were thinking about holiday shopping, year-end work deadlines, or maybe the World Cup happening in Qatar. But in a small office in San Francisco, a company called OpenAI was about to release something that would change how millions of people work, learn, and create.

They called it ChatGPT, and within five days, over one million people had tried it. Within two months, it reached 100 million users—making it the fastest-adopted technology in human history. Faster than the telephone, faster than television, faster than the internet itself.

**The Secret Sauce: Teaching AI to Have Conversations**

But ChatGPT's overnight success was actually 70 years in the making. The breakthrough that made it possible came from an unlikely place: a 2017 research paper with the quirky title "Attention Is All You Need."

Google researchers had invented something called the "transformer architecture"—a new way of building AI systems that could understand language. Previous AI systems read text like you might read a book, word by word from left to right. Transformers were different. They could look at an entire sentence all at once and understand how every word related to every other word.

Consider this sentence: "The bank will guarantee deposits to cover future tuition costs because it has a large fund." A transformer understands that "bank" refers to a financial institution (not a river bank), that "it" refers back to the bank, and that "deposits" means money (not geological sediment). This contextual understanding was revolutionary.

**The Scale Revolution**

But transformer architecture alone wasn't enough. The real breakthrough came when researchers discovered something almost magical: making AI models larger didn't just make them better—it gave them entirely new abilities that nobody had programmed.

GPT-1, released in 2018, had 117 million parameters (think of parameters as the AI's internal settings). It could complete sentences reasonably well. GPT-2, released in 2019, jumped to 1.5 billion parameters and could write coherent paragraphs. GPT-3, released in 2020, exploded to 175 billion parameters.

And something remarkable happened with GPT-3. Without being specifically programmed to do so, it could write poetry, solve math problems, code in multiple programming languages, and engage in sophisticated reasoning. These abilities "emerged" naturally from the complexity of the system—like how consciousness emerges from neurons or how wetness emerges from H2O molecules.

**Making AI Helpful (Not Just Smart)**

When OpenAI created ChatGPT, they added one crucial innovation to their GPT-3.5 model: they taught it to be a good conversational partner.

Using a technique called "Reinforcement Learning from Human Feedback," they had human trainers engage in thousands of conversations with the AI, rating responses and providing feedback. The system learned not just what information to provide, but how to communicate clearly, when to admit uncertainty, and how to be genuinely helpful rather than just technically correct.

This was the missing piece. Previous AI systems might have been incredibly knowledgeable, but they were often hard to use, gave confusing answers, or couldn't maintain a coherent conversation. ChatGPT felt different. It felt like talking to a knowledgeable, patient, and helpful person.

**The Democratization Moment**

For decades, powerful AI had been the exclusive domain of tech companies and research labs. Using AI required coding skills, expensive hardware, and deep technical knowledge. ChatGPT changed all that.

Suddenly, a high school teacher could generate engaging lesson plans by simply describing what they wanted to teach. A small business owner could write marketing copy by explaining their product and target audience. A student struggling with calculus could get step-by-step tutoring. A novelist with writer's block could brainstorm plot ideas.

The barrier to entry wasn't technical expertise anymore—it was just the ability to describe what you needed in plain English.

**The Competitive Gold Rush**

ChatGPT's success triggered the largest tech race since the early days of the internet. Microsoft, which had invested in OpenAI, quickly integrated AI into Office applications and Bing search. Google, caught off guard, rushed to release its own chatbot called Bard. Meta (formerly Facebook) released Llama. Anthropic launched Claude. Startups emerged seemingly overnight, each promising to bring AI to different industries.

But the real revolution wasn't just about chatbots. AI systems began expanding beyond text to handle images, audio, and video. GPT-4 could analyze photographs and describe what it saw. DALL-E could create stunning artwork from text descriptions. AI could generate realistic videos, compose music, and even help control robots.

**Your AI-Powered Daily Life (Right Now)**

Today, in 2024, you probably use AI dozens of times daily without even thinking about it:

When you take a photo with your smartphone, AI automatically adjusts the lighting and focus. When you use Google Maps to navigate traffic, AI is optimizing your route in real-time. When you watch Netflix, AI is curating your recommendations. When you shop online, AI is personalizing what products you see.

Voice assistants like Siri, Alexa, and Google Assistant use AI to understand your questions and provide answers. Your email filters spam using AI. Social media platforms use AI to decide what content appears in your feed. Even your car might use AI for features like automatic emergency braking or parking assistance.

**What's Coming Next**

We're still in the early chapters of the AI revolution. Current AI systems are like personal computers in the 1980s—powerful but still requiring some expertise to use effectively.

The next wave will likely bring AI "agents"—systems that can complete complex, multi-step tasks autonomously. Imagine telling an AI to plan your entire vacation: research destinations based on your interests and budget, compare flight prices, book accommodations, create day-by-day itineraries, make restaurant reservations, and even learn your preferences to make better suggestions for future trips.

Or consider an AI tutor that knows your individual learning style, identifies knowledge gaps in real-time, creates personalized educational content, and adapts its teaching approach based on how you respond to different explanations.

**The Bigger Picture**

We're living through what many historians will likely call one of the most significant technological revolutions in human history—comparable to the printing press, the industrial revolution, or the internet itself.

Unlike previous technological advances that primarily automated physical tasks, AI is beginning to automate cognitive work: writing, analysis, creative problem-solving, and decision-making. This creates unprecedented opportunities but also raises important questions about the future of work, education, and society.

The story of AI is ultimately a story about human ambition and ingenuity. From Alan Turing's wartime codebreaking to your daily conversations with ChatGPT, it's been a 75-year journey of scientists, engineers, and dreamers trying to understand intelligence itself—and in the process, creating tools that amplify human capability in ways previous generations could never have imagined.

**Your Role in This Story**

You're not just witnessing this revolution—you're participating in it. Every time you use AI tools, provide feedback, or find creative ways to integrate AI into your work and life, you're helping shape how these technologies develop.

The future of AI won't be determined by a small group of researchers in Silicon Valley labs. It will be shaped by millions of people like you, discovering new ways to use these tools, pushing for responsible development, and deciding what role we want AI to play in our society.

The story of AI is still being written, and you're one of its authors.`
            }
          }
        },
        
        premium: {
          introduction: "From wartime codebreakers to ChatGPT - discover the incredible 75-year journey that brought AI from science fiction to your pocket. This is the true story of artificial intelligence, told like the fascinating history it is. Premium users get the same detailed content with enhanced interactive features.",
          
          mainContent: {
            // Pre-GPT Foundations (1950s-2021)
            preGptEra: {
              title: "The Foundation Years: Building Toward Breakthrough",
              phases: [
                {
                  period: "1950s-1960s: The Visionaries",
                  description: "Scientists like Alan Turing imagined machines that could think",
                  achievements: ["Turing Test concept", "First AI conferences", "Early neural network theories"],
                  realWorldConnection: "Like early space program - big dreams, basic tools"
                },
                {
                  period: "1970s-1980s: Expert Systems",
                  description: "AI that could make decisions in specific fields like medicine",
                  achievements: ["Medical diagnosis systems", "Chess-playing computers", "Rule-based AI"],
                  realWorldConnection: "Like having a digital doctor that knew medical facts but couldn't have a conversation"
                },
                {
                  period: "1990s-2000s: Machine Learning Emerges",
                  description: "AI that could learn from data instead of just following rules",
                  achievements: ["Email spam filtering", "Recommendation algorithms", "Search engine improvements"],
                  realWorldConnection: "Amazon started suggesting products, Netflix recommended movies"
                },
                {
                  period: "2010s: Deep Learning Revolution",
                  description: "Neural networks got powerful enough to recognize images and understand speech",
                  achievements: ["ImageNet breakthrough", "Voice assistants (Siri, Alexa)", "Self-driving car research"],
                  realWorldConnection: "Your phone could suddenly recognize faces in photos and understand your voice"
                }
              ]
            },
            
            // The GPT Transformation (2022-Present)
            gptTransformation: {
              title: "The ChatGPT Moment: From Tool to Conversation",
              whatChanged: {
                beforeGpt: {
                  description: "AI was mostly invisible - working behind the scenes",
                  examples: ["Search results", "Product recommendations", "Autocorrect", "Photo tagging"],
                  limitation: "You couldn't directly interact with AI using natural language"
                },
                afterGpt: {
                  description: "AI became conversational and generally useful",
                  examples: ["Writing assistance", "Code generation", "Creative brainstorming", "Learning support"],
                  breakthrough: "Anyone could interact with AI using plain English"
                }
              },
              
              whyItMatters: "ChatGPT democratized AI - it went from a specialist tool to something your grandmother could use to write better emails or plan a garden."
            },
            
            // Current AI Ecosystem (2024)
            currentEcosystem: {
              title: "Today's AI Landscape: A Thriving Ecosystem",
              categories: [
                {
                  category: "Text & Language",
                  leaders: ["OpenAI (ChatGPT)", "Anthropic (Claude)", "Google (Gemini)"],
                  capabilities: "Writing, analysis, coding, conversation",
                  useCases: "Content creation, research, customer service, education"
                },
                {
                  category: "Image Generation", 
                  leaders: ["Midjourney", "Stable Diffusion", "DALL-E"],
                  capabilities: "Photorealistic images, artistic styles, design",
                  useCases: "Marketing visuals, concept art, personal creativity"
                },
                {
                  category: "Voice & Audio",
                  leaders: ["ElevenLabs", "PlayHT", "Speechify"],
                  capabilities: "Natural speech synthesis, voice cloning",
                  useCases: "Podcasts, audiobooks, accessibility, content localization"
                },
                {
                  category: "Video Creation",
                  leaders: ["RunwayML", "Pika Labs", "Kling AI"], 
                  capabilities: "Text-to-video, motion graphics, editing",
                  useCases: "Social media content, advertising, storytelling"
                }
              ]
            },
            
            // Future Trajectories
            futureTrajectories: {
              title: "Where We're Headed: The Next Waves",
              nearTerm: {
                timeframe: "2024-2026",
                trends: [
                  "Multimodal AI (text + images + video in one system)",
                  "AI agents that can complete complex tasks autonomously",
                  "Personalized AI tutors for education",
                  "AI integration in all major software platforms"
                ],
                impact: "AI becomes as common as search engines are today"
              },
              mediumTerm: {
                timeframe: "2026-2030", 
                trends: [
                  "AI scientists making breakthrough discoveries",
                  "Highly realistic AI companions and avatars",
                  "AI-generated movies and entertainment",
                  "AI helping solve climate change and healthcare challenges"
                ],
                impact: "AI transforms creative industries and scientific research"
              },
              longTerm: {
                timeframe: "2030+",
                possibilities: [
                  "AI that rivals human intelligence across all domains",
                  "Seamless human-AI collaboration in all professions", 
                  "AI helping design new technologies and solve global problems",
                  "New forms of human-AI creative partnership"
                ],
                uncertainty: "The timeline is uncertain, but the direction is clear: AI will become increasingly capable and integrated into human life"
              }
            }
          },
          
          keyInsights: [
            "AI progress was gradual for 70 years, then suddenly accelerated",
            "Each AI breakthrough built on decades of previous research",
            "The GPT moment made AI accessible to everyone, not just experts",
            "We're still in the early stages of the AI transformation",
            "Understanding AI history helps predict future developments"
          ]
        },
        
        // Note: Advanced level content - same as premium but with additional technical depth
        advanced: {
          introduction: "From wartime codebreakers to ChatGPT - discover the incredible 75-year journey that brought AI from science fiction to your pocket. This is the true story of artificial intelligence, told like the fascinating history it is. Advanced users get the same detailed content with enhanced technical insights.",
          
          mainContent: {
            // Detailed Pre-GPT Analysis
            foundationalEras: {
              title: "The Scientific Foundation: Seven Decades of Progress",
              
              symbolicAI: {
                period: "1950s-1980s: The Symbolic Paradigm",
                keyFigures: ["Alan Turing", "John McCarthy", "Marvin Minsky"],
                approach: "Rule-based systems and formal logic",
                achievements: [
                  "Expert systems like MYCIN and DENDRAL",
                  "Logic programming languages (Prolog)",
                  "Early natural language processing"
                ],
                limitations: "Brittle, couldn't handle ambiguity or learn from data",
                businessImpact: "Limited to specialized domains like medical diagnosis"
              },
              
              connectionist: {
                period: "1980s-2000s: The Connectionist Revival",
                breakthrough: "Backpropagation algorithm enables training of neural networks",
                keyDevelopments: [
                  "Multi-layer perceptrons",
                  "Support vector machines", 
                  "Statistical learning theory"
                ],
                commercialApplications: [
                  "Credit card fraud detection",
                  "Optical character recognition",
                  "Early speech recognition systems"
                ],
                limitations: "Computational constraints limited network size and complexity"
              },
              
              deepLearningRevolution: {
                period: "2006-2021: The Deep Learning Breakthrough",
                catalysts: [
                  "Geoffrey Hinton's deep belief networks (2006)",
                  "ImageNet competition success (2012)",
                  "GPU acceleration for neural networks",
                  "Big data availability"
                ],
                architecturalInnovations: [
                  "Convolutional Neural Networks (CNNs) for vision",
                  "Recurrent Neural Networks (RNNs) for sequences", 
                  "Attention mechanisms and Transformers (2017)",
                  "Generative Adversarial Networks (GANs) for synthesis"
                ],
                industrialTransformation: [
                  "Computer vision: ImageNet accuracy surpassing humans",
                  "Natural language: BERT and early language models",
                  "Autonomous systems: Self-driving car development",
                  "Game AI: AlphaGo defeating world champions"
                ]
              }
            },
            
            // The Transformer Revolution
            transformerParadigm: {
              title: "The Transformer Paradigm: Architecture That Changed Everything",
              
              technicalBreakthrough: {
                innovation: "Attention Is All You Need (2017)",
                significance: "Replaced recurrent architectures with parallel processing",
                advantages: [
                  "Scalability to massive datasets and model sizes",
                  "Transfer learning across domains and tasks",
                  "Emergent capabilities with scale"
                ]
              },
              
              evolutionToGPT: {
                gpt1: "Demonstrated unsupervised learning potential",
                gpt2: "Showed scaling laws and few-shot capabilities", 
                gpt3: "Achieved human-level performance on many language tasks",
                gpt4: "Multimodal capabilities and improved reasoning"
              },
              
              paradigmShift: {
                before: "Task-specific models requiring extensive training data",
                after: "General-purpose models adaptable through prompting",
                implication: "Democratized AI development and deployment"
              }
            },
            
            // Post-GPT Ecosystem Analysis
            postGptLandscape: {
              title: "The Post-GPT Ecosystem: Cambrian Explosion of AI",
              
              marketDynamics: {
                incumbentResponse: [
                  "Google: Bard/Gemini rapid development",
                  "Microsoft: $10B OpenAI investment and Copilot integration", 
                  "Meta: Open-source strategy with Llama models",
                  "Amazon: Bedrock platform for enterprise AI"
                ],
                
                startupInnovation: [
                  "Anthropic: Constitutional AI and safety focus",
                  "Midjourney: Community-driven creative AI",
                  "Stability AI: Open-source generative models",
                  "Character.AI: Conversational AI companions"
                ],
                
                investmentFlows: "Venture capital shifted dramatically toward AI startups, with $40B+ invested in 2023"
              },
              
              technologicalDiversification: {
                modalityExpansion: [
                  "Text-to-image: DALL-E, Midjourney, Stable Diffusion",
                  "Text-to-video: RunwayML, Pika Labs, emerging competitors",
                  "Text-to-audio: ElevenLabs, voice synthesis revolution",
                  "Code generation: GitHub Copilot, transformation of software development"
                ],
                
                architecturalInnovations: [
                  "Retrieval-Augmented Generation (RAG)",
                  "Mixture of Experts (MoE) models",
                  "Multi-agent systems and AI workflows",
                  "Tool-using AI and function calling"
                ]
              }
            },
            
            // Comprehensive Future Analysis
            futureTrajectoryAnalysis: {
              title: "Trajectory Analysis: Mapping the Future of Intelligence",
              
              technicalProgressionCurves: {
                computingPower: {
                  current: "Training runs approaching $100M+ for frontier models",
                  trend: "Exponential growth in compute, offset by efficiency improvements",
                  implications: "Potential for AGI-level capabilities within this decade"
                },
                
                algorithmicEfficiency: {
                  current: "Transformer architecture dominance with incremental improvements",
                  emerging: "New architectures (Mamba, mixture models, neuromorphic approaches)",
                  implications: "Order-of-magnitude efficiency gains possible"
                },
                
                dataScaling: {
                  current: "Internet-scale text data largely exhausted",
                  solutions: "Synthetic data generation, multimodal training, reinforcement learning",
                  implications: "New training paradigms beyond supervised learning"
                }
              },
              
              societalIntegrationPhases: {
                phase1: {
                  timeframe: "2024-2026: Integration and Optimization",
                  characteristics: [
                    "AI embedded in all major software platforms",
                    "Productivity gains across knowledge work",
                    "Educational system transformation beginning",
                    "Creative industry workflow revolution"
                  ]
                },
                
                phase2: {
                  timeframe: "2026-2030: Autonomous Capability Emergence", 
                  characteristics: [
                    "AI agents handling complex multi-step tasks",
                    "Scientific research acceleration through AI assistance",
                    "Human-AI collaboration as standard practice",
                    "Economic productivity gains becoming measurable"
                  ]
                },
                
                phase3: {
                  timeframe: "2030+: Post-Human-Level AI",
                  characteristics: [
                    "AI systems exceeding human experts in most domains",
                    "Fundamental questions about consciousness and agency",
                    "Global governance and coordination challenges",
                    "Potential for technological singularity scenarios"
                  ]
                }
              },
              
              riskAndOpportunityMatrix: {
                opportunities: [
                  "Scientific breakthrough acceleration",
                  "Educational personalization at scale",
                  "Climate change mitigation through optimization",
                  "Healthcare revolution through AI diagnosis and drug discovery"
                ],
                
                risks: [
                  "Labor market displacement faster than adaptation",
                  "Misinformation and manipulation at unprecedented scale",
                  "Concentration of AI power in few organizations",
                  "Alignment challenges as AI systems become more capable"
                ],
                
                mitigationStrategies: [
                  "International AI governance frameworks",
                  "Investment in education and workforce transition",
                  "Open-source AI development to democratize access",
                  "Safety research prioritization and regulation"
                ]
              }
            }
          },
          
          strategicImplications: [
            "We are in the early stages of the most significant technological transformation since the printing press",
            "The gap between AI leaders and followers will determine economic and geopolitical power",
            "Human-AI collaboration skills will become as fundamental as literacy",
            "The next decade will determine whether AI development remains aligned with human values",
            "Understanding AI history provides the framework for navigating an uncertain but transformative future"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'ai_history_timeline',
        
        beginner: {
          instructions: "Let's explore AI history! Put these important moments in the right order from oldest to newest.",
          scenarios: [
            {
              task: "Order these AI milestones from first to last:",
              events: ["ChatGPT released", "First computers built", "Smartphones get voice assistants", "AI beats humans at chess"],
              correct: ["First computers built", "AI beats humans at chess", "Smartphones get voice assistants", "ChatGPT released"],
              explanation: "AI has been developing for over 70 years, with each breakthrough building on the last!"
            },
            {
              task: "Match the AI era with what people could do:",
              pairs: [
                { era: "1990s", capability: "Email spam filtering" },
                { era: "2010s", capability: "Ask Siri questions" },
                { era: "2022+", capability: "Chat with AI like a friend" }
              ],
              explanation: "Each era brought AI closer to how we use it today!"
            }
          ],
          hints: ["Think about when smartphones became popular", "ChatGPT is very recent - just 2022!"]
        },
        
        intermediate: {
          instructions: "Test your understanding of AI's historical progression and its impact on different industries.",
          scenarios: [
            {
              task: "Why was ChatGPT's release in 2022 such a turning point?",
              options: ["It was the first AI ever created", "It made AI conversational for everyone", "It only helped programmers"],
              correct: "It made AI conversational for everyone",
              explanation: "ChatGPT democratized AI by making it accessible through natural conversation, not just technical interfaces."
            },
            {
              task: "What major change happened in the 2010s that enabled modern AI?",
              options: ["The internet was invented", "Deep learning and neural networks improved", "Smartphones were created"],
              correct: "Deep learning and neural networks improved",
              explanation: "The deep learning revolution of the 2010s gave us the foundation for today's powerful AI systems."
            }
          ],
          hints: ["Think about accessibility and ease of use", "Consider what technologies enabled current AI capabilities"]
        },
        
        advanced: {
          instructions: "Analyze the strategic implications of AI's historical development and future trajectory.",
          scenarios: [
            {
              task: "What key factor enabled the transformer architecture to revolutionize AI?",
              options: ["Better marketing by tech companies", "Parallel processing and attention mechanisms", "More venture capital funding"],
              correct: "Parallel processing and attention mechanisms",
              explanation: "The transformer's attention mechanism enabled parallel processing and scalability that made modern large language models possible."
            },
            {
              task: "Which risk factor is most concerning for the next phase of AI development?",
              options: ["Running out of internet data to train on", "AI becoming too expensive", "All AI companies going bankrupt"],
              correct: "Running out of internet data to train on",
              explanation: "Data scarcity is driving innovation in synthetic data and new training paradigms like reinforcement learning."
            }
          ],
          hints: ["Consider technical architecture innovations", "Think about fundamental constraints on AI scaling"]
        }
      },
      
      assessment: {
        beginner: [
          {
            question: "What was the biggest change that happened when ChatGPT was released in 2022?",
            options: ["AI became available to everyone", "AI was invented for the first time", "AI became perfect and never made mistakes"],
            correct: "AI became available to everyone",
            explanation: "ChatGPT made it possible for anyone to talk with AI using normal language, not just computer experts."
          },
          {
            question: "How long has AI been in development before ChatGPT came out?",
            options: ["About 5 years", "About 20 years", "About 70 years"],
            correct: "About 70 years",
            explanation: "AI research started in the 1950s, so it took about 70 years of work to get to ChatGPT!"
          },
          {
            question: "What can we expect AI to help with in the future?",
            options: ["Only computer programming", "Big problems like climate change", "Nothing new"],
            correct: "Big problems like climate change",
            explanation: "AI is getting better at helping solve complex challenges that affect everyone."
          }
        ],
        
        intermediate: [
          {
            question: "What was the key limitation of AI systems before the deep learning revolution of the 2010s?",
            options: ["They were too expensive", "They couldn't learn from data effectively", "They were only available to universities"],
            correct: "They couldn't learn from data effectively",
            explanation: "Early AI relied on hand-coded rules. Deep learning enabled systems to learn patterns from massive datasets."
          },
          {
            question: "Why did ChatGPT represent such a paradigm shift in AI accessibility?",
            options: ["It was the first free AI tool", "It eliminated the need for technical knowledge to use AI", "It could run on smartphones"],
            correct: "It eliminated the need for technical knowledge to use AI", 
            explanation: "ChatGPT democratized AI by enabling natural language interaction, making it accessible to non-technical users."
          },
          {
            question: "What is the most likely trajectory for AI development in the next 5-10 years?",
            options: ["AI will plateau at current capabilities", "AI will become increasingly integrated into daily workflows", "AI development will slow down significantly"],
            correct: "AI will become increasingly integrated into daily workflows",
            explanation: "We're seeing rapid integration of AI into existing tools and the emergence of new AI-powered workflows across industries."
          }
        ],
        
        advanced: [
          {
            question: "What architectural innovation made the transformer paradigm revolutionary for AI development?",
            options: ["Faster processors", "Attention mechanisms enabling parallel processing", "Better funding for research"],
            correct: "Attention mechanisms enabling parallel processing",
            explanation: "The attention mechanism in transformers enabled parallel processing and scalability that made large language models feasible."
          },
          {
            question: "Which factor poses the greatest constraint on continued scaling of current AI architectures?",
            options: ["Computational cost", "Internet-scale text data exhaustion", "Lack of research talent"],
            correct: "Internet-scale text data exhaustion",
            explanation: "High-quality text data is becoming scarce, driving research into synthetic data generation and new training paradigms."
          },
          {
            question: "What distinguishes the post-GPT AI landscape from previous eras?",
            options: ["Better marketing by AI companies", "Cambrian explosion of specialized AI applications", "Government regulation"],
            correct: "Cambrian explosion of specialized AI applications",
            explanation: "Post-GPT, we've seen rapid diversification into multimodal applications across text, image, video, and audio domains."
          }
        ]
      },
      
      xpRewards: { beginner: 15, intermediate: 20, advanced: 30 },
      estimatedTime: { beginner: 8, intermediate: 12, advanced: 18 }
    },

    // LESSON 2: How AI "Thinks"
    {
      id: 'how-ai-thinks',
      title: 'How AI "Thinks" — From Data to Decisions',
      lessonType: 'concept_explanation_with_interaction',
      order: 2,
      
      coreConcept: "AI doesn't think like us. It doesn't feel, reason, or understand the world—it predicts. This lesson explains how large language models are trained and generate responses by identifying patterns in data.",
      
      content: {
        beginner: {
          introduction: "AI might seem super smart, but it's actually just really good at guessing! Let's learn how AI 'thinks' by predicting what comes next.",
          
          mainContent: {
            training: "AI learns by reading millions of books, websites, and conversations. It's like studying really hard by reading everything in a huge library!",
            tokens: "AI sees words as puzzle pieces called 'tokens'. The word 'happy' might be one piece, and AI tries to guess what piece comes next.",
            inference: "When you ask AI a question, it looks at all the patterns it learned and makes its best guess for the answer.",
            
            examples: [
              "You say 'The sky is...' and AI guesses 'blue' because it saw that pattern many times",
              "Ask for a story about cats, and AI combines cat patterns with story patterns",
              "AI fills in missing words like a smart autocomplete when you're writing emails or homework",
              "Ask 'How do I make cookies?' and AI uses recipe patterns it learned to help you bake",
              "Request a bedtime story and AI combines story patterns to create something new for your kids"
            ]
          },
          
          keyPoints: [
            "AI doesn't really understand - it just guesses really well",
            "AI learned from reading lots of text",
            "AI predicts the next word, then the next, to build answers"
          ]
        },
        
        intermediate: {
          introduction: "Understanding how AI generates responses helps you craft better prompts and set realistic expectations for AI capabilities.",
          
          mainContent: {
            training: "Large language models are trained on massive datasets using thousands of GPUs over weeks/months, adjusting billions of parameters to predict text patterns.",
            tokens: "Text is tokenized into chunks (words, subwords, or characters). Models predict the next token based on context, building responses iteratively.",
            inference: "During inference, the model processes your input through learned patterns to generate probabilistic predictions for the most likely response.",
            
            technicalConcepts: [
              "Temperature controls randomness - higher = more creative, lower = more focused",
              "Context window limits how much conversation history the model remembers",
              "Training data cutoff means models have knowledge limitations"
            ]
          },
          
          practicalImplications: [
            "AI responses are probabilistic, not deterministic - same question might get different creative answers",
            "Models don't learn from individual conversations (unless fine-tuned) - they won't remember you personally",
            "Prompting techniques can guide but not guarantee specific outputs - useful for creative projects and problem-solving",
            "Understanding AI limitations helps you fact-check important information for school or personal decisions",
            "AI works best as a creative partner and thinking assistant for hobbies, learning, and daily tasks"
          ]
        },
        
        advanced: {
          introduction: "Comprehensive understanding of AI decision-making from basic pattern recognition to sophisticated transformer architectures and enterprise implementation strategies.",
          
          foundationalMechanisms: {
            basicConcept: "AI learns patterns from examples rather than understanding concepts, similar to an advanced autocomplete system",
            trainingProcess: "AI reads millions of books and websites to learn how words typically follow each other in human communication",
            predictionMechanism: "When asked a question, AI uses learned patterns to predict the most likely sequence of words that would follow"
          },
          
          technicalArchitectures: {
            transformers: "Modern AI uses transformer architectures with attention mechanisms to model complex dependencies in sequential data",
            training: "Training involves next-token prediction on massive corpora using gradient descent optimization, with techniques like reinforcement learning from human feedback (RLHF) for alignment",
            tokenization: "Text is broken into tokens (word pieces) - tokenization strategies (BPE, SentencePiece) significantly affect model performance",
            attention: "Attention mechanisms allow models to weight relevant context dynamically, enabling understanding of long-range dependencies"
          },
          
          generationMechanisms: {
            inference: "Generation uses techniques like beam search, nucleus sampling, and temperature scaling to balance coherence and diversity in outputs",
            parameters: "Models have billions to trillions of parameters (learned weights) that encode patterns from training data",
            contextWindow: "Limited memory capacity determines how much conversation history the model can consider",
            temperature: "Controls randomness - low temperature (0.1) gives focused responses, high temperature (0.9) gives creative responses"
          },
          
          architecturalDetails: [
            "Multi-head attention enables parallel processing of different representation subspaces",
            "Layer normalization and residual connections enable stable training of deep networks", 
            "Positional encodings provide sequence information in the absence of recurrence",
            "Transformer blocks stack to create increasingly sophisticated representations",
            "Feed-forward networks within each block process information in parallel"
          ],
          
          practicalImplications: [
            "AI responses are probabilistic, not deterministic - same prompt can yield different outputs",
            "Models don't learn from individual conversations unless specifically fine-tuned",
            "Prompting techniques can guide but not guarantee specific outputs",
            "Understanding token limits helps optimize conversation flow and cost"
          ],
          
          limitationsAndChallenges: [
            "Hallucination emerges from the probabilistic nature of generation - AI can confidently state false information",
            "Knowledge cutoffs mean models lack information about recent events",
            "Training data biases affect model behavior and outputs",
            "Computational costs scale with sequence length and model size",
            "Models can exhibit inconsistent reasoning across similar problems"
          ],
          
          businessConsiderations: [
            "Cost optimization through model selection and prompt engineering",
            "Quality assurance processes to catch and correct hallucinations",
            "Integration strategies for existing workflows and systems",
            "Performance monitoring and continuous improvement frameworks"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'prediction_exercise',
        
        beginner: {
          instructions: "Try completing these sentences like AI would. What do you think comes next?",
          exercises: [
            {
              prompt: "The sun rises in the...",
              expectedAnswers: ["east", "morning"],
              explanation: "AI learned this pattern from many examples!"
            }
          ]
        },
        
        intermediate: {
          instructions: "Explore how different prompting techniques affect AI responses. Try the same request with different approaches.",
          exercises: [
            {
              prompt: "Compare: 'Tell me about dogs' vs 'You are a veterinarian. Explain dog behavior to a new pet owner in 3 clear points.'",
              focus: "Structure and role-setting",
              explanation: "Specific prompts guide AI to more useful responses"
            }
          ]
        },
        
        advanced: {
          instructions: "Analyze how temperature and context window affect model behavior.",
          exercises: [
            {
              prompt: "Test the same prompt with different temperature settings",
              focus: "Understanding generation parameters",
              explanation: "Temperature affects the probability distribution over tokens"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 15, intermediate: 20, advanced: 30 },
      estimatedTime: { beginner: 10, intermediate: 15, advanced: 20 }
    },

    // LESSON 3: AI Vocabulary Bootcamp
    {
      id: 'ai-vocabulary-bootcamp',
      title: 'AI Vocabulary Bootcamp: Master 25 Essential Terms',
      lessonType: 'interactive_vocabulary',
      order: 3,
      
      coreConcept: "Learning AI's vocabulary gives you power. These 25 essential terms will help you understand AI discussions, ask better questions, explore advanced tools, and communicate effectively about artificial intelligence.",
      
      content: {
        beginner: {
          introduction: "Learning AI words is like learning the rules of a game - it helps you play better! Let's learn the most important AI words that everyone should know. Don't worry about memorizing everything - focus on understanding the big ideas!",
          
          vocabulary: [
            { 
              term: "AI (Artificial Intelligence)", 
              definition: "Smart computer programs that can think and learn like humans", 
              whatItMeans: "Computers doing tasks that usually need human intelligence",
              example: "ChatGPT answering questions, Siri understanding your voice, or Netflix suggesting movies you might like",
              category: "Core Concepts"
            },
            { 
              term: "LLM (Large Language Model)", 
              definition: "A super smart AI that works with words and language", 
              whatItMeans: "An AI trained on millions of books and websites to understand and create text",
              example: "ChatGPT, Claude, and Gemini are all LLMs that can write stories, answer questions, and help with homework",
              category: "Core Concepts"
            },
            { 
              term: "Prompt", 
              definition: "What you type to tell the AI what you want", 
              whatItMeans: "Your instructions, questions, or requests to the AI",
              example: "'Write a funny story about a cat' or 'Help me with my math homework' are prompts",
              category: "How to Use AI"
            },
            { 
              term: "Token", 
              definition: "Small pieces that AI breaks words into to understand them", 
              whatItMeans: "AI doesn't see whole words - it sees little chunks like 'wonder' and 'ful'",
              example: "The word 'wonderful' might be split into 'wonder' + 'ful' = 2 tokens",
              category: "How AI Works"
            },
            { 
              term: "Hallucination", 
              definition: "When AI makes up information that sounds real but isn't true", 
              whatItMeans: "AI sometimes creates fake facts confidently, like a person making up stories",
              example: "AI saying 'February has 31 days' or inventing a fake book title that sounds real",
              category: "AI Problems"
            },
            { 
              term: "Temperature", 
              definition: "A setting that controls how creative or focused the AI is", 
              whatItMeans: "Like a creativity dial - high = more random and creative, low = more focused and predictable",
              example: "High temperature: creative poetry. Low temperature: accurate math answers",
              category: "AI Settings"
            },
            { 
              term: "Training Data", 
              definition: "All the books, websites, and text the AI learned from", 
              whatItMeans: "Like the textbooks AI studied before it could help you",
              example: "AI learned from millions of Wikipedia articles, books, and websites to understand how language works",
              category: "How AI Learns"
            },
            { 
              term: "Algorithm", 
              definition: "Step-by-step instructions that tell the computer what to do", 
              whatItMeans: "Like a recipe that the computer follows to solve problems",
              example: "An algorithm might say: 1) Read the question, 2) Find patterns, 3) Generate an answer",
              category: "Computer Science"
            },
            { 
              term: "Machine Learning", 
              definition: "Teaching computers to learn patterns and make decisions from examples", 
              whatItMeans: "Instead of programming every answer, we show computers lots of examples and let them figure out patterns",
              example: "Showing a computer 1000 pictures of cats so it learns to recognize cats in new pictures",
              category: "Core Concepts"
            },
            { 
              term: "Chatbot", 
              definition: "A computer program designed to have conversations with people", 
              whatItMeans: "An AI assistant you can talk to through typing or speaking",
              example: "ChatGPT, Siri, Alexa, and customer service chat windows are all chatbots",
              category: "AI Applications"
            },
            { 
              term: "API", 
              definition: "A way for different computer programs to talk to each other", 
              whatItMeans: "Like a translator that helps your app use AI services",
              example: "When you use ChatGPT in another app, that app uses OpenAI's API to connect",
              category: "Technical Terms"
            },
            { 
              term: "Neural Network", 
              definition: "Computer system designed to work like a simplified version of the human brain", 
              whatItMeans: "Lots of connected computer 'neurons' that work together to solve problems",
              example: "Just like your brain has billions of connected neurons, AI has artificial ones that process information",
              category: "How AI Works"
            }
          ]
        },
        
        intermediate: {
          introduction: "Now let's dive deeper into AI terminology. These terms will help you understand how AI works, discuss AI capabilities professionally, and make informed decisions about AI tools for work and projects.",
          
          vocabulary: [
            { 
              term: "Context Window", 
              definition: "The amount of text (conversation history) that an AI can remember and work with at one time", 
              whatItMeans: "AI has a memory limit - it can only 'see' a certain amount of your conversation at once",
              example: "GPT-3.5 can remember about 4,000 words of conversation, while GPT-4 can remember 8,000-32,000 words",
              implications: ["Longer contexts = better understanding", "Limited by model architecture", "Affects conversation quality"],
              category: "AI Capabilities"
            },
            { 
              term: "Fine-tuning", 
              definition: "Additional training of an AI model on specific data to specialize it for particular tasks", 
              whatItMeans: "Taking a general AI and teaching it to be really good at specific jobs",
              example: "Fine-tuning ChatGPT on legal documents to create a legal assistant AI",
              applications: ["Medical diagnosis", "Legal analysis", "Customer service", "Industry-specific tasks"],
              category: "AI Development"
            },
            { 
              term: "Multimodal", 
              definition: "AI that can understand and work with different types of data: text, images, audio, and video", 
              whatItMeans: "Instead of just text, the AI can see pictures, hear audio, and understand videos",
              example: "GPT-4V can analyze images and answer questions about what it sees",
              capabilities: ["Image analysis", "Video understanding", "Audio processing", "Cross-modal reasoning"],
              category: "AI Capabilities"
            },
            { 
              term: "Inference", 
              definition: "The process where a trained AI model generates responses or makes predictions", 
              whatItMeans: "The actual moment when AI thinks and gives you an answer",
              example: "When you ask ChatGPT a question, the inference process generates the response you see",
              considerations: ["Response speed", "Computational cost", "Output quality"],
              category: "Technical Process"
            },
            { 
              term: "Embeddings", 
              definition: "Mathematical representations of words, sentences, or concepts that AI uses to understand meaning", 
              whatItMeans: "AI converts words into numbers so it can do math with language and find similar concepts",
              example: "Words like 'happy', 'joyful', and 'cheerful' have similar embeddings because they mean similar things",
              applications: ["Semantic search", "Recommendation systems", "Language translation"],
              category: "How AI Works"
            },
            { 
              term: "Zero-shot Learning", 
              definition: "AI's ability to perform tasks it wasn't specifically trained for, using general knowledge", 
              whatItMeans: "AI can figure out new tasks without seeing examples first",
              example: "Asking ChatGPT to write a haiku about computers, even though it wasn't specifically trained to write haikus",
              significance: "Shows AI's general intelligence and flexibility",
              category: "AI Capabilities"
            },
            { 
              term: "Few-shot Learning", 
              definition: "Teaching AI a new task by showing it just a few examples in your prompt", 
              whatItMeans: "Giving AI 2-3 examples so it understands the pattern you want",
              example: "Showing AI: 'dog → puppy, cat → kitten, horse → ?' and it learns to say 'foal'",
              applications: ["Custom formatting", "Specific writing styles", "Data transformation"],
              category: "Prompting Techniques"
            },
            { 
              term: "Bias", 
              definition: "Unfair preferences or prejudices that AI might learn from training data", 
              whatItMeans: "AI can accidentally learn human prejudices from the internet and books it studied",
              example: "AI might associate certain professions with specific genders if that's what it saw in training data",
              importance: "Understanding bias helps us use AI more fairly and responsibly",
              category: "AI Ethics"
            },
            { 
              term: "Overfitting", 
              definition: "When AI memorizes training examples too specifically and can't generalize to new situations", 
              whatItMeans: "Like a student who memorizes answers but doesn't understand the concepts",
              example: "An AI trained only on photos of golden retrievers might not recognize other dog breeds",
              prevention: ["Diverse training data", "Proper validation", "Regularization techniques"],
              category: "AI Problems"
            },
            { 
              term: "Generative AI", 
              definition: "AI that creates new content like text, images, music, or code", 
              whatItMeans: "AI that makes new things instead of just analyzing existing things",
              example: "ChatGPT generates text, DALL-E generates images, GitHub Copilot generates code",
              contrast: "Different from AI that just classifies or analyzes existing content",
              category: "AI Types"
            }
          ]
        },
        
        advanced: {
          introduction: "Master these advanced AI terms to engage in technical discussions, understand AI research, implement AI solutions, and make strategic decisions about AI adoption in professional contexts.",
          
          vocabulary: [
            { 
              term: "Transformer Architecture", 
              definition: "The neural network design using attention mechanisms that revolutionized natural language processing", 
              whatItMeans: "The breakthrough technology that allows AI to understand context and relationships in text",
              significance: "Foundation of modern LLMs like GPT, BERT, and most current AI systems",
              keyFeatures: ["Self-attention mechanism", "Parallel processing", "Scalability"],
              impact: "Enabled the current AI revolution in language understanding",
              category: "AI Architecture"
            },
            { 
              term: "Attention Mechanism", 
              definition: "AI's ability to focus on relevant parts of input when processing information", 
              whatItMeans: "Like human attention - AI learns which parts of text are most important for understanding",
              example: "In 'The cat sat on the mat', attention helps AI know 'cat' and 'sat' are more important than 'the'",
              types: ["Self-attention", "Cross-attention", "Multi-head attention"],
              category: "AI Mechanisms"
            },
            { 
              term: "RLHF (Reinforcement Learning from Human Feedback)", 
              definition: "Training method where humans rate AI responses to teach it preferred behaviors", 
              whatItMeans: "Like training a pet with treats - humans tell AI which responses are good or bad",
              purpose: "Makes AI more helpful, harmless, and honest",
              process: ["Initial training", "Human feedback collection", "Reward model training", "Policy optimization"],
              category: "AI Training"
            },
            { 
              term: "RAG (Retrieval-Augmented Generation)", 
              definition: "Combining LLMs with real-time access to external knowledge bases", 
              whatItMeans: "Giving AI access to current information beyond its training data",
              benefits: ["Up-to-date information", "Reduced hallucination", "Fact verification"],
              useCase: "Customer service bots accessing current product catalogs",
              category: "AI Enhancement"
            },
            { 
              term: "Quantization", 
              definition: "Reducing the precision of model weights to decrease memory usage and increase speed", 
              whatItMeans: "Making AI models smaller and faster by using less detailed numbers",
              tradeoffs: ["Smaller file size vs. slight accuracy loss", "Faster inference vs. reduced capability"],
              applications: ["Mobile AI", "Edge computing", "Cost reduction"],
              category: "AI Optimization"
            },
            { 
              term: "Emergent Abilities", 
              definition: "Capabilities that appear in large AI models that weren't present in smaller versions", 
              whatItMeans: "New skills that 'emerge' when AI models get big enough, like magic thresholds",
              examples: ["Chain-of-thought reasoning", "In-context learning", "Complex problem decomposition"],
              significance: "Suggests AI capabilities may grow unpredictably with scale",
              category: "AI Phenomena"
            },
            { 
              term: "Constitutional AI", 
              definition: "Training AI to follow a set of principles or 'constitution' for ethical behavior", 
              whatItMeans: "Teaching AI a moral framework to guide its decisions",
              principles: ["Be helpful and harmless", "Respect human autonomy", "Be truthful"],
              developer: "Primarily developed by Anthropic for Claude",
              category: "AI Safety"
            },
            { 
              term: "Parameter", 
              definition: "Individual weights in a neural network that get adjusted during training", 
              whatItMeans: "The 'knobs' that get tuned to make AI work - more parameters often mean more capability",
              scale: "Modern LLMs have billions to trillions of parameters",
              example: "GPT-3 has 175 billion parameters, GPT-4 has estimated 1.7 trillion",
              category: "AI Architecture"
            },
            { 
              term: "Alignment", 
              definition: "Ensuring AI systems pursue intended goals and behave according to human values", 
              whatItMeans: "Making sure AI wants what we want and acts in ways we approve of",
              challenges: ["Value specification", "Goal preservation", "Robustness"],
              importance: "Critical for safe and beneficial AI development",
              category: "AI Safety"
            }
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'comprehensive_vocabulary_practice',
        
        beginner: {
          instructions: "Let's practice these AI terms with fun activities! Complete these exercises to show you understand the basics. Don't worry about getting everything perfect - learning takes time!",
          exercises: [
            { 
              type: "matching",
              title: "Match the Term to Its Meaning",
              items: [
                { term: "Prompt", definition: "What you type to AI" },
                { term: "Token", definition: "Small word pieces" },
                { term: "LLM", definition: "Smart word AI" },
                { term: "Hallucination", definition: "When AI makes up fake facts" },
                { term: "Temperature", definition: "Creativity setting for AI" },
                { term: "Training Data", definition: "Text AI learned from" }
              ]
            },
            {
              type: "fill_in_blank",
              title: "Complete the Sentences",
              sentences: [
                "When I type 'Write a story about dogs' to ChatGPT, that text is called a _____.",
                "AI breaks words into small pieces called _____.",
                "If AI says 'February has 35 days', that's called a _____.",
                "ChatGPT is an example of an _____ (three letters)."
              ],
              answers: ["prompt", "tokens", "hallucination", "LLM"],
              hints: ["Your instruction to AI", "Word chunks", "Fake information", "Large Language Model"]
            },
            {
              type: "category_sort",
              title: "Sort These Terms into Categories",
              terms: ["Prompt", "Neural Network", "Chatbot", "Token", "Machine Learning", "API"],
              categories: {
                "How to Use AI": ["Prompt"],
                "How AI Works": ["Neural Network", "Token", "Machine Learning"],
                "AI Applications": ["Chatbot"],
                "Technical Terms": ["API"]
              }
            },
            {
              type: "true_false",
              title: "True or False?",
              statements: [
                { statement: "AI always tells the truth", answer: false, explanation: "AI can have hallucinations and make mistakes" },
                { statement: "Higher temperature makes AI more creative", answer: true, explanation: "High temperature = more creative, low = more focused" },
                { statement: "Tokens are whole words", answer: false, explanation: "Tokens are often parts of words" },
                { statement: "LLMs learned from reading lots of text", answer: true, explanation: "They trained on billions of web pages and books" }
              ]
            }
          ]
        },
        
        intermediate: {
          instructions: "Apply your AI knowledge to real scenarios. Choose the best terms and explain your reasoning for professional contexts.",
          exercises: [
            {
              type: "scenario_choice",
              title: "Choose the Best Term for Each Situation",
              scenarios: [
                {
                  scenario: "You want the AI to remember your entire conversation",
                  options: ["Context Window", "Temperature", "Hallucination", "Fine-tuning"],
                  correct: "Context Window",
                  explanation: "Context window determines how much conversation history the AI can remember and use"
                },
                {
                  scenario: "You need AI to be an expert on your company's specific products",
                  options: ["Zero-shot Learning", "Fine-tuning", "Temperature", "Embeddings"],
                  correct: "Fine-tuning",
                  explanation: "Fine-tuning trains the AI on your specific company data to become specialized"
                },
                {
                  scenario: "You want to build an AI that can analyze both text and images",
                  options: ["Multimodal", "Generative AI", "Context Window", "Bias"],
                  correct: "Multimodal",
                  explanation: "Multimodal AI can work with different types of data including text and images"
                }
              ]
            },
            {
              type: "definition_builder",
              title: "Build Definitions Using Key Concepts",
              terms: [
                {
                  term: "Few-shot Learning",
                  keyWords: ["examples", "pattern", "prompt", "learning"],
                  correctDefinition: "Teaching AI a new task by showing it a few examples in your prompt",
                  userPrompt: "Use the key words to build a definition"
                },
                {
                  term: "Embeddings",
                  keyWords: ["mathematical", "words", "numbers", "meaning"],
                  correctDefinition: "Mathematical representations that convert words into numbers to capture meaning",
                  userPrompt: "Combine these words into a clear definition"
                }
              ]
            },
            {
              type: "application_analysis",
              title: "Analyze Real-World Applications",
              applications: [
                {
                  description: "Netflix recommends movies you might like",
                  relevantTerms: ["Machine Learning", "Embeddings", "Algorithm"],
                  question: "Which terms are most relevant to how this works?",
                  explanation: "Netflix uses machine learning algorithms and embeddings to find patterns in viewing habits"
                },
                {
                  description: "Google Translate converts text between languages",
                  relevantTerms: ["Transformer Architecture", "Embeddings", "Training Data"],
                  question: "What AI concepts enable real-time translation?",
                  explanation: "Transformers and embeddings help understand language structure across different languages"
                }
              ]
            }
          ]
        },
        
        advanced: {
          instructions: "Demonstrate mastery of technical AI concepts. Analyze complex scenarios and make strategic recommendations based on your understanding.",
          exercises: [
            {
              type: "technical_scenario",
              title: "Technical Implementation Analysis",
              scenarios: [
                {
                  challenge: "Your company needs a chatbot that provides accurate, up-to-date product information and never gives outdated details",
                  considerations: ["RAG vs Fine-tuning", "Hallucination prevention", "Context Window management"],
                  bestApproach: "RAG with external knowledge base",
                  reasoning: "RAG allows real-time access to current product data, reducing hallucination risk and avoiding the need to retrain models",
                  alternatives: {
                    "Fine-tuning": "Would require retraining every time products change",
                    "Simple prompting": "Higher risk of hallucination without external data verification"
                  }
                },
                {
                  challenge: "Building an AI system that needs to run efficiently on mobile devices with limited memory",
                  considerations: ["Quantization", "Parameter count", "Inference speed"],
                  bestApproach: "Quantized model with parameter reduction",
                  reasoning: "Quantization reduces memory usage while maintaining acceptable performance for mobile deployment",
                  tradeoffs: ["Slight accuracy reduction for significant efficiency gains"]
                }
              ]
            },
            {
              type: "concept_integration",
              title: "Integrate Multiple AI Concepts",
              prompts: [
                {
                  task: "Design an AI writing assistant for legal professionals",
                  requiredConcepts: ["Fine-tuning", "Constitutional AI", "Bias", "RLHF"],
                  evaluation: "Explain how each concept contributes to the solution",
                  exemplarResponse: "Fine-tuning on legal documents provides domain expertise, Constitutional AI ensures ethical guidelines, bias mitigation prevents unfair legal advice, and RLHF aligns outputs with professional standards"
                },
                {
                  task: "Explain why Large Language Models show emergent abilities",
                  requiredConcepts: ["Parameters", "Transformer Architecture", "Training Data", "Emergent Abilities"],
                  evaluation: "Connect the technical concepts to explain the phenomenon",
                  exemplarResponse: "As transformer models scale to billions of parameters and train on massive datasets, complex reasoning capabilities emerge that weren't explicitly programmed"
                }
              ]
            },
            {
              type: "strategic_decision",
              title: "Make Strategic AI Adoption Decisions",
              businessCases: [
                {
                  scenario: "Fortune 500 company considering AI implementation",
                  factors: ["Cost", "Alignment", "Bias", "Safety"],
                  decision: "Recommend implementation approach considering technical and ethical factors",
                  considerations: [
                    "How to ensure AI alignment with company values",
                    "Strategies for bias detection and mitigation",
                    "Constitutional AI principles for ethical deployment",
                    "RLHF for continuous improvement"
                  ]
                }
              ]
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 40, advanced: 50 },
      estimatedTime: { beginner: 15, intermediate: 18, advanced: 20 }
    }
  ],

  'prompting-skills': [
    // LESSON 4: Prompting Essentials
    {
      id: 'prompting-essentials',
      title: 'Prompting Essentials',
      lessonType: 'hands_on_practice',
      order: 4,
      
      coreConcept: "Prompts are your steering wheel. When you give clear, structured prompts, you guide the AI to deliver better, more useful, and more accurate responses.",
      
      content: {
        beginner: {
          introduction: "AI is like a helpful friend who follows instructions exactly. Let's learn how to give really clear instructions!",
          
          promptElements: [
            { element: "Be Specific", example: "Instead of 'help me write', say 'help me write a thank you note to my teacher'" },
            { element: "Give Context", example: "Tell AI who you are: 'I'm a 5th grader who needs to...' " },
            { element: "Ask for Format", example: "Say 'give me 3 bullet points' or 'write 2 paragraphs'" }
          ],
          
          examples: [
            {
              weak: "Tell me about dogs",
              strong: "I'm doing a school report. Tell me 3 cool facts about golden retrievers for 4th graders.",
              why: "The strong prompt says who you are, what you need, and how you want it"
            },
            {
              weak: "Help me cook dinner",
              strong: "I'm a beginner cook with chicken, rice, and vegetables. Give me a simple 30-minute recipe with step-by-step instructions.",
              why: "Tells AI your skill level, ingredients available, time constraint, and format needed"
            },
            {
              weak: "Plan my weekend",
              strong: "Help me plan a fun Saturday for my family with 2 kids (ages 6 and 10). We like outdoor activities and have a $50 budget.",
              why: "Provides context about family size, ages, preferences, and budget constraints"
            }
          ]
        },
        
        intermediate: {
          introduction: "Effective prompting is about clear communication. Structure your requests like you would with a professional assistant.",
          
          promptFramework: [
            { component: "Role", description: "Set the AI's perspective", example: "You are a marketing expert..." },
            { component: "Task", description: "Clearly state what you want", example: "Create a social media strategy..." },
            { component: "Context", description: "Provide relevant background", example: "For a new coffee shop in Seattle..." },
            { component: "Format", description: "Specify output structure", example: "Provide 5 bullet points with explanations..." }
          ],
          
          examples: [
            {
              weak: "Help me with my presentation",
              strong: "You are a presentation coach. Help me create an outline for a 10-minute presentation about renewable energy for my college environmental science class. Provide 5 main sections with 2-3 talking points each.",
              improvements: ["Clear role", "Specific task", "Relevant context", "Defined format"]
            },
            {
              weak: "I need workout advice",
              strong: "You are a fitness trainer. Create a beginner-friendly home workout plan for someone with 30 minutes, 3 times per week, no equipment needed. Include warm-up, exercises, and cool-down with modification options.",
              improvements: ["Expert role", "Specific constraints", "Clear requirements", "Accommodation needs"]
            },
            {
              weak: "Help me learn Spanish",
              strong: "You are a language tutor. Design a 2-week Spanish learning plan for a complete beginner who wants to have basic conversations during a Mexico vacation. Include daily 15-minute lessons with practical phrases.",
              improvements: ["Teaching role", "Specific timeline", "Clear goal", "Practical application"]
            }
          ]
        },
        
        advanced: {
          introduction: "Master comprehensive prompting strategies from basic clarity to sophisticated enterprise-grade techniques for consistent, high-quality AI outputs.",
          
          foundationalPrinciples: {
            clarity: "Be specific about what you want - replace 'help me write' with 'help me write a thank you note to my teacher'",
            context: "Provide relevant background - tell AI who you are and what situation you're in",
            format: "Specify desired output structure - bullet points, paragraphs, tables, etc.",
            examples: "Show AI what good output looks like through concrete examples"
          },
          
          professionalFramework: {
            role: "Set the AI's perspective and expertise level for appropriate responses",
            task: "Clearly define the specific deliverable or action you need",
            context: "Provide all relevant background information and constraints",
            format: "Specify structure, length, tone, and presentation requirements",
            audience: "Define who will consume the output and their expertise level"
          },
          
          advancedTechniques: [
            { 
              technique: "Chain-of-Thought Reasoning", 
              description: "Guide AI through explicit step-by-step thinking processes",
              structure: "Let's think step by step: 1) Analyze the problem, 2) Consider alternatives, 3) Evaluate options, 4) Recommend solution",
              applications: ["Complex problem solving", "Strategic analysis", "Technical troubleshooting"],
              benefits: ["More accurate results", "Transparent reasoning", "Reduced errors"]
            },
            {
              technique: "Few-Shot Learning Patterns",
              description: "Establish format and style through 2-3 concrete examples",
              structure: "Input: 'excited' → Output: 'thrilled'. Input: 'sad' → Output: 'devastated'. Input: 'happy' → Output: ?",
              applications: ["Data transformation", "Style consistency", "Format standardization"],
              benefits: ["Consistent outputs", "Reduced ambiguity", "Scalable processes"]
            },
            {
              technique: "Role-Based Expertise",
              description: "Assign detailed personas with specific knowledge and perspective",
              structure: "You are Dr. Sarah Chen, a behavioral economist with 15 years of experience in consumer psychology, specializing in decision-making frameworks...",
              applications: ["Expert analysis", "Specialized advice", "Professional communication"],
              benefits: ["Domain-specific insights", "Appropriate terminology", "Credible responses"]
            },
            {
              technique: "Iterative Refinement",
              description: "Build on previous responses to progressively improve quality",
              structure: "Initial prompt → Review output → Specific feedback → Refined result",
              applications: ["Content improvement", "Quality assurance", "Progressive development"],
              benefits: ["Higher final quality", "Efficient improvement", "Learning from mistakes"]
            },
            {
              technique: "Multi-Perspective Analysis",
              description: "Consider issues from multiple stakeholder viewpoints",
              structure: "Analyze this from the perspectives of: [customer], [business], [technical team], [regulators]",
              applications: ["Strategic planning", "Risk assessment", "Comprehensive analysis"],
              benefits: ["Reduced blind spots", "Balanced solutions", "Stakeholder buy-in"]
            }
          ],
          
          enterprisePatterns: [
            {
              pattern: "Template-Driven Consistency",
              description: "Create reusable prompt templates for common business processes",
              implementation: "Standardized templates with variables for different contexts",
              benefits: ["Consistent quality", "Reduced training time", "Scalable operations"]
            },
            {
              pattern: "Quality Assurance Integration", 
              description: "Build verification and validation into prompt workflows",
              implementation: "Multi-step prompts with built-in checking and correction",
              benefits: ["Reduced errors", "Automated quality control", "Reliable outputs"]
            },
            {
              pattern: "Context Management",
              description: "Optimize information flow across long conversations",
              implementation: "Strategic use of context windows and information prioritization",
              benefits: ["Efficient processing", "Cost optimization", "Maintained coherence"]
            }
          ],
          
          measurementAndOptimization: [
            "Output quality metrics and evaluation frameworks",
            "Cost optimization through prompt efficiency",
            "Response time improvement strategies",
            "Consistency measurement across different AI models"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'prompt_builder',
        
        beginner: {
          instructions: "Practice building better prompts! Take a weak prompt and make it stronger.",
          exercises: [
            {
              scenario: "You want help planning a birthday party",
              weakPrompt: "Help me plan a party",
              guidedImprovement: {
                step1: "Who is the party for?",
                step2: "How many people?",
                step3: "What format do you want?",
                strongPrompt: "Help me plan a 10th birthday party for my daughter with 8 kids. Give me a simple checklist of things to do."
              }
            }
          ]
        },
        
        intermediate: {
          instructions: "Build professional-quality prompts using the Role-Task-Context-Format framework.",
          exercises: [
            {
              scenario: "Create content for a fitness app",
              framework: {
                role: "You are a certified personal trainer and nutrition expert",
                task: "Create a beginner workout plan",
                context: "For busy professionals who have 30 minutes, 3 times per week",
                format: "Provide a weekly schedule with exercise descriptions and progression tips"
              }
            }
          ]
        },
        
        advanced: {
          instructions: "Implement sophisticated prompting strategies for complex reasoning tasks.",
          exercises: [
            {
              challenge: "Design a prompt for strategic business analysis",
              requirements: ["Multi-step reasoning", "Consideration of alternatives", "Risk assessment", "Actionable recommendations"],
              evaluation: "Assess completeness, logical flow, and practical applicability"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 25, intermediate: 30, advanced: 40 },
      estimatedTime: { beginner: 12, intermediate: 15, advanced: 20 }
    },

    // LESSON 5: Prompt Engineering in Action
    {
      id: 'prompt-engineering-action',
      title: 'Prompt Engineering in Action',
      lessonType: 'advanced_practice',
      order: 5,
      
      coreConcept: "Prompt engineering is a craft. By using examples, structure, and step-by-step logic, you can get the AI to think, explain, and perform more like a professional assistant.",
      
      content: {
        beginner: {
          introduction: "Now let's get really good at talking to AI! We'll learn some tricks that make AI give much better answers.",
          
          techniques: [
            {
              name: "Show Examples",
              description: "Give AI 2-3 examples of what you want, then let it follow the pattern",
              example: "Turn sad into happy: gloomy → bright, frowning → smiling, crying → laughing. Now do: worried → ?",
              personalUse: "Great for creating games with kids, learning new words, or making creative lists"
            },
            {
              name: "Ask for Steps",
              description: "Tell AI to think step-by-step",
              example: "What's 15 x 12? Think step-by-step and show your work.",
              personalUse: "Perfect for homework help, cooking instructions, or learning new skills"
            },
            {
              name: "Try Again Better",
              description: "If the first answer isn't great, ask AI to improve it",
              example: "That's good, but can you make it simpler for a 6-year-old?",
              personalUse: "Useful for getting explanations at the right level for yourself or your family"
            }
          ]
        },
        
        intermediate: {
          introduction: "Master advanced prompting techniques to consistently achieve professional-quality results from AI systems.",
          
          techniques: [
            {
              name: "Few-Shot Prompting",
              description: "Provide 2-3 examples to establish format and style",
              structure: "Example 1: [input] → [desired output]\nExample 2: [input] → [desired output]\nNow do: [your input] → ?",
              applications: ["Data formatting", "Style consistency", "Complex transformations"]
            },
            {
              name: "Chain-of-Thought Reasoning",
              description: "Guide AI through explicit reasoning steps",
              triggers: ["Let's think step by step", "Break this down systematically", "Consider each factor"],
              benefits: ["More accurate results", "Transparent reasoning", "Better problem-solving"]
            },
            {
              name: "Iterative Refinement",
              description: "Build on previous responses to improve quality",
              process: ["Initial prompt", "Review output", "Specific feedback", "Refined result"],
              example: "Good start. Now make it more concise and add specific examples."
            }
          ]
        },
        
        advanced: {
          introduction: "Master the complete spectrum of prompt engineering from basic examples to sophisticated enterprise-grade patterns for complex reasoning and specialized applications.",
          
          foundationalTechniques: {
            examples: "Show AI 2-3 examples of desired output format to establish patterns",
            stepByStep: "Break complex tasks into sequential steps with clear reasoning",
            iterativeImprovement: "Build on previous responses with specific feedback for refinement"
          },
          
          professionalMethodologies: [
            {
              method: "Few-Shot Pattern Establishment",
              description: "Create consistent outputs through example-driven learning",
              structure: "Example 1: [input] → [output]\nExample 2: [input] → [output]\nNow: [your input] → ?",
              applications: ["Data formatting", "Style consistency", "Quality standardization"],
              benefits: ["Predictable results", "Reduced training", "Scalable processes"]
            },
            {
              method: "Chain-of-Thought Reasoning",
              description: "Guide AI through explicit reasoning pathways",
              triggers: ["Let's think step by step", "Break this down systematically", "Consider each factor in order"],
              structure: "Problem → Analysis → Options → Evaluation → Recommendation",
              benefits: ["More accurate results", "Transparent reasoning", "Better problem-solving"]
            },
            {
              method: "Iterative Quality Enhancement",
              description: "Systematically improve outputs through guided refinement",
              process: ["Initial prompt", "Review output quality", "Provide specific feedback", "Generate improved version"],
              techniques: ["Make it more concise", "Add specific examples", "Adjust tone for audience"],
              applications: ["Content optimization", "Professional communication", "Technical documentation"]
            }
          ],
          
          sophisticatedPatterns: [
            {
              name: "Multi-Turn Reasoning Workflows",
              description: "Decompose complex problems into manageable analytical steps",
              pattern: "First, analyze the current situation. Then, identify key challenges. Next, consider potential solutions. Finally, synthesize recommendations with implementation steps.",
              applications: ["Strategic planning", "Technical analysis", "Research synthesis", "Business consulting"],
              complexity: "Handles multi-faceted problems requiring comprehensive analysis"
            },
            {
              name: "Multi-Perspective Analysis",
              description: "Leverage multiple viewpoints for comprehensive understanding",
              structure: "Consider this from the perspectives of: [customer], [business], [technical team], [regulators], [competitors]",
              benefits: ["Reduced bias", "Comprehensive coverage", "Creative solutions", "Stakeholder alignment"],
              applications: ["Product strategy", "Risk assessment", "Change management"]
            },
            {
              name: "Meta-Prompting Optimization",
              description: "Use AI to improve its own prompts for better results",
              technique: "Before answering, critique and improve this prompt: [original prompt]. Then use your improved version to provide the response.",
              use_cases: ["Prompt optimization", "Quality assurance", "Self-correction", "Performance tuning"],
              benefits: ["Continuous improvement", "Automated optimization", "Error reduction"]
            },
            {
              name: "Conditional Logic Flows",
              description: "Create dynamic prompts that adapt based on context and requirements",
              structure: "If [condition A], then [approach A]. If [condition B], then [approach B]. Determine which applies and proceed accordingly.",
              applications: ["Decision trees", "Adaptive responses", "Contextual recommendations"],
              complexity: "Handles variable scenarios with different optimal approaches"
            }
          ],
          
          enterpriseImplementation: [
            {
              strategy: "Template Standardization",
              description: "Create organization-wide prompt templates for consistent results",
              implementation: "Develop template library with variables for common business processes",
              benefits: ["Consistent quality", "Reduced training", "Scalable operations", "Brand alignment"]
            },
            {
              strategy: "Quality Assurance Integration",
              description: "Build verification and validation into all prompt workflows", 
              implementation: "Multi-step prompts with built-in checking, correction, and approval processes",
              benefits: ["Reduced errors", "Automated quality control", "Compliance assurance"]
            },
            {
              strategy: "Performance Optimization",
              description: "Continuously improve prompt effectiveness through measurement and refinement",
              metrics: ["Output quality scores", "Time to completion", "User satisfaction", "Error rates"],
              implementation: "A/B testing of prompt variations with systematic improvement cycles"
            }
          ],
          
          advancedConsiderations: [
            "Token efficiency optimization for cost management",
            "Context window management for long-form interactions",
            "Model-specific adaptation for different AI systems",
            "Integration with existing business workflows and systems",
            "Training and adoption strategies for teams and organizations"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'technique_practice',
        
        beginner: {
          instructions: "Practice the three main techniques: examples, step-by-step thinking, and trying again.",
          exercises: [
            {
              technique: "Examples",
              task: "Create a few-shot prompt to turn animals into their sounds",
              starter: "cow → moo, cat → meow, dog → ?"
            }
          ]
        },
        
        intermediate: {
          instructions: "Apply advanced techniques to achieve professional results. Focus on consistency and quality.",
          exercises: [
            {
              challenge: "Create email templates for different business scenarios",
              requirements: ["Few-shot pattern", "Professional tone", "Scalable format"],
              evaluation: "Consistency, professionalism, adaptability"
            }
          ]
        },
        
        advanced: {
          instructions: "Design sophisticated prompt strategies for complex analytical tasks.",
          exercises: [
            {
              scenario: "Market analysis for a new product launch",
              techniques: ["Multi-perspective analysis", "Chain-of-thought reasoning", "Iterative refinement"],
              deliverable: "Comprehensive analysis with actionable insights"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 35, advanced: 45 },
      estimatedTime: { beginner: 15, intermediate: 18, advanced: 20 }
    }
  ],

  'creative-applications': [
    // LESSON 6: Creative AI — Art, Video, and Voice
    {
      id: 'creative-ai-mastery',
      title: 'Creative AI — Art, Video, and Voice',
      lessonType: 'multimodal_practice',
      order: 6,
      
      coreConcept: "AI doesn't just write—it can help you create images, videos, and even realistic voices, just by describing what you want in detail. This lesson shows how to guide creative AIs effectively.",
      
      content: {
        beginner: {
          introduction: "Imagine telling someone to draw a picture just by describing it! That's what creative AI can do. Let's learn how to make amazing art, videos, and voices with AI.",
          
          tools: [
            { type: "Image AI", tools: "DALL-E, Midjourney", description: "Creates pictures from your words", example: "A cute robot eating ice cream", personalUse: "Make custom art for your room, gifts, or social media" },
            { type: "Video AI", tools: "RunwayML, Kling AI", description: "Makes short videos", example: "A paper airplane flying through clouds", personalUse: "Create fun family videos, hobby content, or learning materials" },
            { type: "Voice AI", tools: "ElevenLabs", description: "Creates realistic voices", example: "A friendly storyteller reading a bedtime story", personalUse: "Make audiobooks for kids, podcast intros, or voiceovers for personal videos" }
          ],
          
          promptingTips: [
            "Be descriptive: 'A happy golden retriever playing in a sunny park with colorful flowers'",
            "Mention the style: 'like a cartoon' or 'like a photograph'",
            "For voices: say if you want it happy, sad, excited, or calm"
          ]
        },
        
        intermediate: {
          introduction: "Creative AI tools are revolutionizing content creation. Master these tools to enhance your projects with professional-quality visuals and audio.",
          
          toolCategories: [
                {
                  category: "Image Generation", 
              tools: ["Midjourney", "DALL-E 3", "Stable Diffusion"],
              applications: ["Marketing materials", "Social media content", "Custom artwork for home", "Gifts and personal projects", "Concept art", "Product mockups"],
              promptStructure: "Subject + Setting + Style + Technical specs"
            },
            {
              category: "Video Generation", 
              tools: ["RunwayML", "Pika Labs", "Kling AI"],
              applications: ["Family memories", "Hobby documentation", "Social media clips", "Learning videos", "Explainer videos", "Product demos", "Animated content"],
              promptStructure: "Scene description + Camera movement + Duration + Style"
            },
            {
              category: "Voice Synthesis",
              tools: ["ElevenLabs", "Murf", "Play.ht"],
              applications: ["Personal storytelling", "Bedtime stories for kids", "Language learning", "Voiceovers", "Podcasts", "Audio books", "Accessibility"],
              promptStructure: "Text + Voice characteristics + Emotion + Speed"
            }
          ],
          
          bestPractices: [
            "Start with clear, specific descriptions",
            "Iterate on prompts to refine results",
            "Consider your target audience and use case",
            "Combine multiple tools for complex projects"
          ]
        },
        
        advanced: {
          introduction: "Master comprehensive creative AI production from basic tool usage through sophisticated enterprise workflows with consistent quality and brand alignment.",
          
          foundationalCreativeSkills: {
            imagePrompting: "Learn to describe visuals clearly: subject, setting, style, mood, and technical specifications",
            videoConceptualization: "Plan moving content with scene descriptions, camera movement, duration, and style direction",
            voiceCharacterization: "Define voice characteristics: emotion, pace, accent, and personality for different use cases"
          },
          
          professionalToolMastery: [
            {
              category: "Advanced Image Generation",
              tools: ["Midjourney", "DALL-E 3", "Stable Diffusion"],
              techniques: [
                "Style consistency through custom prompts and parameters",
                "Brand guideline integration and color palette control",
                "Batch generation with systematic variations",
                "Quality optimization through iterative refinement"
              ],
              businessApplications: ["Marketing campaigns", "Product visualization", "Social media content", "Brand asset creation"],
              technicalSpecs: ["1024x1024+ resolution", "Multiple aspect ratios", "Style transfer", "Inpainting and outpainting"]
            },
            {
              category: "Professional Video Production", 
              tools: ["RunwayML", "Pika Labs", "Kling AI", "Stable Video"],
              workflows: [
                "Storyboard creation and visual planning",
                "Scene-by-scene generation with continuity",
                "Motion control and camera movement specification",
                "Post-production integration and enhancement"
              ],
              businessApplications: ["Advertising content", "Training materials", "Social media campaigns", "Product demonstrations"],
              technicalSpecs: ["4K resolution capability", "Variable frame rates", "Motion consistency", "Text-to-video generation"]
            },
            {
              category: "Enterprise Voice Synthesis",
              tools: ["ElevenLabs", "Murf", "Play.ht", "Azure Speech"],
              capabilities: [
                "Custom voice cloning for brand consistency",
                "Multi-language localization at scale",
                "Emotional range and tone control",
                "Real-time generation and API integration"
              ],
              businessApplications: ["Podcast production", "Training narration", "Customer service", "Accessibility solutions"],
              technicalSpecs: ["High-fidelity audio", "Real-time streaming", "Voice cloning", "SSML control"]
            }
          ],
          
          enterpriseWorkflows: [
            {
              workflow: "Integrated Brand Asset Pipeline",
              scope: "End-to-end brand content creation with consistency",
              steps: [
                "Brand guideline analysis and prompt template creation",
                "Style guide implementation across all AI tools",
                "Automated asset generation with quality checkpoints",
                "Brand compliance verification and approval workflow"
              ],
              tools: ["Style guides → Midjourney → Brand validation → Asset library"],
              benefits: ["Consistent brand identity", "Scalable content production", "Reduced design costs"]
            },
            {
              workflow: "Multi-Modal Content Production",
              scope: "Coordinated creation across text, image, video, and audio",
              steps: [
                "Content strategy and narrative development",
                "Script generation and visual storyboarding", 
                "Coordinated asset creation across modalities",
                "Integration and post-production optimization"
              ],
              integration: ["ChatGPT → Midjourney → RunwayML → ElevenLabs → Editing suite"],
              applications: ["Marketing campaigns", "Educational content", "Product launches"]
            },
            {
              workflow: "Automated Content Localization",
              scope: "Multi-language, multi-cultural content adaptation",
              steps: [
                "Source content analysis and adaptation planning",
                "Cultural sensitivity review and modification",
                "Automated translation and visual adaptation",
                "Quality assurance and cultural validation"
              ],
              considerations: ["Cultural sensitivity", "Legal compliance", "Brand consistency"],
              scalability: "Support for 50+ languages and cultural contexts"
            }
          ],
          
          qualityAndConsistency: [
            {
              aspect: "Style Management",
              techniques: ["Custom style guides", "Parameter optimization", "Reference image libraries"],
              implementation: "Systematic prompt engineering with brand-specific modifiers"
            },
            {
              aspect: "Quality Assurance",
              processes: ["Automated quality scoring", "Human review workflows", "Iterative improvement"],
              metrics: ["Visual consistency scores", "Brand alignment metrics", "User satisfaction ratings"]
            },
            {
              aspect: "Scalability Planning",
              considerations: ["API rate limits", "Cost optimization", "Workflow automation"],
              strategies: ["Batch processing", "Priority queuing", "Resource allocation optimization"]
            }
          ],
          
          strategicImplementation: [
            "ROI measurement and optimization strategies",
            "Team training and adoption frameworks", 
            "Integration with existing creative workflows",
            "Legal and licensing compliance for commercial use",
            "Performance monitoring and continuous improvement systems"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'creative_prompt_lab',
        
        beginner: {
          instructions: "Create prompts for different creative AI tools. Focus on being descriptive and specific!",
          exercises: [
            {
              task: "Create an image prompt for a birthday party invitation",
              elements: ["Subject", "Setting", "Style", "Mood"],
              example: "A colorful birthday party with balloons and cake, cartoon style, happy and festive"
            }
          ]
        },
        
        intermediate: {
          instructions: "Design professional creative prompts for business use cases. Consider brand consistency and target audience.",
          exercises: [
            {
              scenario: "Social media campaign for a coffee shop",
              requirements: ["Brand colors", "Consistent style", "Multiple formats"],
              deliverable: "Series of coordinated image prompts"
            }
          ]
        },
        
        advanced: {
          instructions: "Build comprehensive creative workflows combining multiple AI tools for complex projects.",
          exercises: [
            {
              project: "Product launch campaign",
              components: ["Hero images", "Explainer video", "Voice narration"],
              challenge: "Maintain brand consistency across all generated content"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 25, intermediate: 35, advanced: 50 },
      estimatedTime: { beginner: 15, intermediate: 18, advanced: 20 }
    },

    // LESSON 7: Workflow Ideas Without Agents
    {
      id: 'ai-workflow-fundamentals',
      title: 'AI Workflow Fundamentals',
      lessonType: 'system_thinking',
      order: 7,
      
      coreConcept: "Even without full AI agents, you can build workflows using sequences of prompts across different tools. This teaches you how to think in systems and combine strengths.",
      
      content: {
        beginner: {
          introduction: "You can be like a conductor of an orchestra, telling different AI tools what to do in the right order to create something amazing!",
          
          workflowConcept: "A workflow is like following a recipe - you do step 1, then step 2, then step 3, using different AI tools for each step.",
          
          simpleWorkflows: [
            {
              name: "Story Creation",
              steps: [
                "1. Ask ChatGPT to write a short story",
                "2. Ask DALL-E to draw the main character", 
                "3. Ask ElevenLabs to read the story out loud"
              ],
              result: "A complete story with picture and audio!"
            },
            {
              name: "School Project Helper",
              steps: [
                "1. Ask AI to explain a topic simply",
                "2. Ask AI to make a fun drawing about it",
                "3. Ask AI to help write a summary"
              ],
              result: "A complete project with text and visuals!"
            }
          ]
        },
        
        intermediate: {
          introduction: "Systematic AI workflows enable you to tackle complex projects by breaking them into manageable steps and leveraging specialized tools.",
          
          workflowPrinciples: [
            "Identify the end goal and work backwards",
            "Choose the right tool for each specific task",
            "Ensure outputs from one step feed effectively into the next",
            "Build in quality control and iteration points"
          ],
          
          businessWorkflows: [
            {
              name: "Content Marketing Pipeline",
              steps: [
                "Research topic (ChatGPT)",
                "Create outline (Claude)", 
                "Write content (GPT-4)",
                "Generate visuals (Midjourney)",
                "Create social posts (ChatGPT + Midjourney)"
              ],
              benefits: ["Consistent quality", "Reduced time", "Scalable process"]
            },
            {
              name: "Customer Communication",
              steps: [
                "Analyze customer inquiry (Claude)",
                "Draft response template (ChatGPT)",
                "Personalize for specific case (GPT-4)",
                "Review and send"
              ],
              benefits: ["Faster response time", "Consistent tone", "Higher quality"]
            }
          ]
        },
        
        advanced: {
          introduction: "Enterprise-grade AI workflows require sophisticated orchestration, error handling, and optimization strategies for maximum efficiency and reliability.",
          
          advancedPatterns: [
            {
              pattern: "Parallel Processing",
              description: "Execute multiple AI tasks simultaneously",
              example: "Generate product descriptions, marketing copy, and technical specs in parallel",
              benefits: ["Reduced total time", "Resource optimization"]
            },
            {
              pattern: "Conditional Logic",
              description: "Different paths based on AI output analysis",
              example: "If sentiment analysis shows negative feedback → escalation path, else → standard response",
              implementation: ["Output classification", "Decision trees", "Automated routing"]
            },
            {
              pattern: "Quality Assurance Loops",
              description: "Built-in verification and improvement cycles",
              example: "Generate → Review → Refine → Validate → Deploy",
              components: ["Automated checking", "Human review points", "Iteration limits"]
            }
          ],
          
          scalingConsiderations: [
            "API rate limits and cost management",
            "Error handling and fallback strategies", 
            "Monitoring and performance optimization",
            "Version control and workflow documentation"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'workflow_builder',
        
        beginner: {
          instructions: "Design a simple 3-step workflow using different AI tools. Think about what order makes sense!",
          exercises: [
            {
              goal: "Create a birthday card",
              tools: ["ChatGPT", "DALL-E", "Your computer"],
              challenge: "Plan the steps to make a complete birthday card with text and image"
            }
          ]
        },
        
        intermediate: {
          instructions: "Build a professional workflow for a business scenario. Consider efficiency and quality control.",
          exercises: [
            {
              scenario: "Weekly newsletter creation",
              requirements: ["Research", "Writing", "Visuals", "Formatting"],
              goal: "Design a repeatable 5-step process"
            }
          ]
        },
        
        advanced: {
          instructions: "Architect a complex workflow with conditional logic and quality assurance. Consider scalability and error handling.",
          exercises: [
            {
              challenge: "Customer service automation workflow",
              requirements: ["Classification", "Response generation", "Quality check", "Human handoff"],
              complexity: "Handle multiple customer types and issue categories"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 40, advanced: 55 },
      estimatedTime: { beginner: 18, intermediate: 20, advanced: 20 }
    }
  ],

  'practical-applications': [
    // LESSON 8: AI for School, Work, and Life
    {
      id: 'ai-daily-applications',
      title: 'AI for School, Work, and Life',
      lessonType: 'practical_application',
      order: 8,
      
      coreConcept: "AI is your daily assistant—helping with homework, writing, planning, and managing your time. This lesson shows how to make AI genuinely useful.",
      
      content: {
        beginner: {
          introduction: "AI can help you with real things you do every day! Let's learn how to use AI for school, home, and fun activities.",
          
          schoolHelp: [
            "Explain hard topics in simple words",
            "Help check your homework and understand mistakes",
            "Make flashcards for studying any subject",
            "Help write reports and essays with better structure",
            "Create practice quizzes to test yourself",
            "Get help with math problems step-by-step"
          ],
          
          homeHelp: [
            "Plan what to cook for dinner based on what's in your fridge",
            "Help organize your room with fun storage ideas",
            "Plan fun activities for weekends and holidays",
            "Help with chores and family schedules",
            "Create gift ideas for friends and family",
            "Plan family game nights and movie selections"
          ],
          
          personalGrowth: [
            "Learn new hobbies with step-by-step guidance",
            "Practice conversations in other languages",
            "Get fitness and health advice tailored to you",
            "Plan travel itineraries for family trips",
            "Create creative writing and art projects",
            "Develop new skills through personalized lessons"
          ],
          
          simplePrompts: [
            "Explain [topic] like I'm 10 years old",
            "Help me make a list of things to do for [activity]",
            "What are 3 fun ways to learn about [subject]?",
            "Plan a perfect day for someone who loves [hobby/interest]",
            "What should I cook tonight with [ingredients I have]?",
            "Help me understand why [something confusing] works the way it does"
          ]
        },
        
        intermediate: {
          introduction: "AI can significantly boost your productivity across all areas of life. Learn to integrate AI tools into your daily routines for maximum benefit.",
          
          categories: [
            {
              area: "Academic Success",
              applications: [
                "Research assistance and source finding",
                "Essay structure and outline creation", 
                "Study schedule optimization",
                "Concept explanation and examples",
                "Practice quiz generation"
              ],
              promptTemplates: [
                "Create a study plan for [subject] with [time available]",
                "Explain [concept] with real-world examples",
                "Generate 10 practice questions for [topic]"
              ]
            },
            {
              area: "Professional Productivity",
              applications: [
                "Email drafting and tone adjustment",
                "Meeting agenda creation",
                "Report writing and data analysis",
                "Project planning and task breakdown",
                "Presentation outline development"
              ],
              promptTemplates: [
                "Draft a professional email about [topic] with [tone]",
                "Create an agenda for [meeting type] lasting [duration]",
                "Break down [project] into actionable tasks"
              ]
            },
            {
              area: "Personal Life Enhancement",
              applications: [
                "Meal planning and grocery lists for families",
                "Travel itinerary creation for vacations and trips",
                "Budget planning and expense tracking for personal finance",
                "Health and fitness goal setting and workout plans",
                "Home organization systems and decluttering",
                "Hobby development and skill learning pathways",
                "Creative project planning and execution",
                "Gift planning and event organization"
              ],
              promptTemplates: [
                "Create a weekly meal plan for [family size] with [dietary preferences] and [budget]",
                "Plan a [duration] family trip to [destination] with activities for [ages/interests]",
                "Design a personal budget for [income] with goals like [saving for vacation/house/etc.]",
                "Create a beginner's guide to [hobby] with weekly progression steps",
                "Help me organize my [room/garage/closet] with creative storage solutions for [specific items]"
              ]
            }
          ]
        },
        
        advanced: {
          introduction: "Advanced AI integration creates comprehensive productivity systems that adapt to your specific needs and optimize your effectiveness across all life domains.",
          
          systemicApproaches: [
            {
              system: "Personal Knowledge Management",
              components: [
                "Information capture and processing",
                "Knowledge synthesis and connection", 
                "Insight generation and application",
                "Continuous learning optimization"
              ],
              implementation: [
                "AI-assisted note organization",
                "Concept mapping and relationship identification",
                "Personalized learning path creation",
                "Knowledge gap analysis and filling"
              ]
            },
            {
              system: "Professional Development Acceleration",
              components: [
                "Skill gap identification",
                "Learning resource curation",
                "Practice opportunity creation",
                "Progress tracking and adjustment"
              ],
              implementation: [
                "Career path analysis with AI guidance",
                "Customized skill development plans",
                "AI-generated practice scenarios",
                "Performance feedback and improvement suggestions"
              ]
            },
            {
              system: "Personal Life Optimization Framework",
              components: [
                "Goal setting and prioritization for personal growth",
                "Resource allocation optimization for family time and hobbies",
                "Progress monitoring and adjustment for health, learning, and projects",
                "Success pattern identification for habits and personal development"
              ],
              implementation: [
                "AI-assisted life design and planning for work-life balance",
                "Automated progress tracking for fitness, learning goals, and creative projects",
                "Predictive modeling for personal decision making and family planning",
                "Continuous optimization recommendations for daily routines and happiness"
              ],
              personalApplications: [
                "Family scheduling and activity optimization",
                "Personal learning journey design and tracking",
                "Health and wellness goal achievement systems",
                "Creative project and hobby development pathways",
                "Financial planning and saving goal acceleration",
                "Relationship and social life enhancement strategies"
              ]
            }
          ],
          
          integrationStrategies: [
            "Cross-platform workflow automation",
            "Personalized AI assistant configuration",
            "Data-driven decision making systems",
            "Continuous improvement feedback loops"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'real_world_application',
        
        beginner: {
          instructions: "Choose a real problem from your life and solve it using AI! Make it practical and useful.",
          exercises: [
            {
              categories: ["School homework", "Planning an event", "Learning something new", "Organizing your space"],
              task: "Pick one area and create 3 prompts that would actually help you",
              evaluation: "How useful would these prompts be in real life?"
            }
          ]
        },
        
        intermediate: {
          instructions: "Create a comprehensive AI-assisted solution for a complex life challenge. Focus on practical implementation.",
          exercises: [
            {
              scenarios: [
                "Starting a new job and getting up to speed quickly",
                "Planning a major life change (moving, career switch)",
                "Developing a new skill for personal or professional growth"
              ],
              requirements: ["Multi-step approach", "Different AI tools", "Measurable outcomes"],
              deliverable: "Complete action plan with AI integration points"
            }
          ]
        },
        
        advanced: {
          instructions: "Design a comprehensive AI-powered productivity system for long-term success. Consider sustainability and scalability.",
          exercises: [
            {
              challenge: "Create a 6-month personal development system",
              components: ["Goal setting", "Daily routines", "Progress tracking", "Adaptation mechanisms"],
              innovation: "How can AI make this system more effective than traditional approaches?"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 35, intermediate: 45, advanced: 60 },
      estimatedTime: { beginner: 18, intermediate: 20, advanced: 20 }
    },

    // LESSON 9: Hosting AI Locally & Open Source Models
    {
      id: 'local-ai-mastery',
      title: 'Hosting AI Locally & Open Source Models',
      lessonType: 'technical_exploration',
      order: 9,
      
      coreConcept: "You don't have to rely on cloud tools—AI can run on your own computer. This lesson explains why and how to use open-source models locally.",
      
      content: {
        beginner: {
          introduction: "Did you know AI can work on your own computer? Let's learn about having your very own AI that works even without the internet!",
          
          whyLocal: [
            "Your conversations stay private on your computer - great for personal journals or private thoughts",
            "It works even without internet - perfect for camping trips or travel",
            "You don't have to pay monthly fees - save money for family activities instead",
            "You can use it as much as you want - no limits on creative projects or learning time",
            "Kids can use it safely without internet concerns",
            "Perfect for homework help when internet is slow or unavailable"
          ],
          
          simpleOptions: [
            { name: "ChatGPT Desktop App", description: "Easy to install, works like the website", difficulty: "Super Easy" },
            { name: "Character.AI", description: "Fun AI characters on your phone", difficulty: "Easy" },
            { name: "GPT4All", description: "Free AI that runs on your computer", difficulty: "Medium" }
          ],
          
          whatYouNeed: [
            "A computer (not too old)",
            "Some space on your hard drive", 
            "Patience to download and learn"
          ]
        },
        
        intermediate: {
          introduction: "Local AI gives you control, privacy, and cost savings. Understanding the options and requirements helps you choose the right approach for your needs.",
          
          benefits: [
            { benefit: "Privacy", description: "Your data never leaves your device", importance: "Critical for personal journals, family planning, and sensitive conversations" },
            { benefit: "Cost Control", description: "No monthly subscriptions or per-use charges", importance: "More money for family activities and hobbies" },
            { benefit: "Customization", description: "Fine-tune models for specific use cases", importance: "Perfect for family learning styles and personal interests" },
            { benefit: "Offline Access", description: "Works without internet connection", importance: "Great for travel, remote areas, and when kids need homework help" }
          ],
          
          popularTools: [
            {
              tool: "Ollama",
              description: "Easy-to-use local AI runner",
              models: ["Llama 2", "Mistral", "CodeLlama"],
              requirements: "8GB+ RAM, modern CPU",
              useCase: "General text generation and coding help"
            },
            {
              tool: "LM Studio", 
              description: "User-friendly interface for running models",
              models: ["Wide variety of open source models"],
              requirements: "16GB+ RAM recommended",
              useCase: "Experimentation and model comparison"
            },
            {
              tool: "Text Generation WebUI",
              description: "Advanced interface with many customization options",
              models: ["Most open source language models"],
              requirements: "GPU recommended for speed",
              useCase: "Power users and researchers"
            }
          ],
          
          considerations: [
            "Model size vs performance tradeoffs",
            "Hardware requirements and costs",
            "Setup complexity and maintenance",
            "Community support and documentation"
          ]
        },
        
        advanced: {
          introduction: "Advanced local AI deployment enables enterprise-grade solutions with full control over infrastructure, security, and performance optimization.",
          
          architecturalOptions: [
            {
              approach: "Single-Node Deployment",
              description: "Run models on individual workstations or servers",
              pros: ["Simple setup", "Direct control", "Lower complexity"],
              cons: ["Limited scalability", "Resource constraints"],
              bestFor: ["Individual users", "Small teams", "Development work"]
            },
            {
              approach: "Distributed Computing",
              description: "Spread model execution across multiple machines",
              pros: ["Higher performance", "Scalability", "Resource sharing"],
              cons: ["Complex setup", "Network dependencies"],
              bestFor: ["Large teams", "High-demand applications", "Research"]
            },
            {
              approach: "Hybrid Cloud-Local",
              description: "Combine local processing with cloud resources",
              pros: ["Flexibility", "Cost optimization", "Redundancy"],
              cons: ["Complexity", "Integration challenges"],
              bestFor: ["Enterprise deployments", "Variable workloads"]
            }
          ],
          
          optimizationStrategies: [
            {
              strategy: "Model Quantization",
              description: "Reduce model precision to decrease memory usage",
              techniques: ["4-bit", "8-bit", "16-bit quantization"],
              tradeoffs: "Smaller size and faster inference vs potential accuracy loss"
            },
            {
              strategy: "Hardware Acceleration", 
              description: "Leverage specialized hardware for performance",
              options: ["GPU acceleration", "Apple Silicon optimization", "Intel/AMD optimizations"],
              considerations: "Hardware compatibility and driver requirements"
            },
            {
              strategy: "Model Selection",
              description: "Choose optimal models for specific use cases",
              factors: ["Task specialization", "Language support", "Performance requirements"],
              approach: "Benchmark multiple models against your specific needs"
            }
          ],
          
          enterpriseConsiderations: [
            "Security and compliance requirements",
            "Model governance and version control",
            "Performance monitoring and optimization",
            "Integration with existing systems and workflows"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'local_ai_planner',
        
        beginner: {
          instructions: "Plan your first local AI setup! Think about what you want to do and what you have available.",
          exercises: [
            {
              assessment: [
                "What do you want to use AI for?",
                "What kind of computer do you have?",
                "How comfortable are you with downloading software?"
              ],
              recommendation: "Based on your answers, we'll suggest the best starting option for you",
              nextSteps: "Simple checklist to get started"
            }
          ]
        },
        
        intermediate: {
          instructions: "Design a local AI solution for a specific use case. Consider requirements, tools, and implementation steps.",
          exercises: [
            {
              scenarios: [
                "Privacy-focused writing assistant for sensitive documents",
                "Offline coding assistant for remote development work",
                "Local customer service chatbot for small business"
              ],
              planning: ["Requirements analysis", "Tool selection", "Implementation roadmap"],
              deliverable: "Complete setup plan with cost and time estimates"
            }
          ]
        },
        
        advanced: {
          instructions: "Architect an enterprise-grade local AI deployment. Consider scalability, security, and performance optimization.",
          exercises: [
            {
              challenge: "Design local AI infrastructure for a 100-person company",
              requirements: ["Security compliance", "Multi-user access", "Performance at scale"],
              complexity: "Balance cost, performance, and operational complexity"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 45, advanced: 65 },
      estimatedTime: { beginner: 15, intermediate: 18, advanced: 20 }
    },

    // LESSON 10: AI Problem-Solving Lab
    {
      id: 'ai-problem-solving-capstone',
      title: 'AI Problem-Solving Lab',
      lessonType: 'capstone_project',
      order: 10,
      
      coreConcept: "You've learned the tools—now use them. This lab helps you solve realistic problems using your prompting skills and preferred tools.",
      
      content: {
        beginner: {
          introduction: "Time to put everything together! Choose a fun challenge and show what you've learned. This is your chance to be creative and solve real problems.",
          
          challengeCategories: [
            {
              category: "Creative Projects",
              challenges: [
                "Create a complete children's book (story + illustrations + narration)",
                "Design a poster for a school event with AI tools",
                "Make a fun video about your hobby or interest"
              ]
            },
            {
              category: "Helpful Solutions",
              challenges: [
                "Plan a perfect birthday party for someone you know",
                "Create a study guide for your hardest subject",
                "Design a weekly schedule that includes everything you need to do"
              ]
            },
            {
              category: "Learning Adventures",
              challenges: [
                "Explore a topic you're curious about and create a presentation",
                "Learn about a country you want to visit and plan a virtual trip",
                "Research a career you're interested in and create an action plan",
                "Design a learning plan for a new hobby you want to try",
                "Create a family activity guide for your local area",
                "Plan and organize a themed party or celebration"
              ]
            },
            {
              category: "Personal Growth Projects",
              challenges: [
                "Create a personal fitness and wellness plan with AI coaching",
                "Design a monthly budget and savings plan for a big goal",
                "Plan and document a skill-learning journey (cooking, music, art)",
                "Organize and optimize your living space with AI suggestions",
                "Create personalized language learning materials for family trips",
                "Design a reading challenge with book recommendations and tracking"
              ]
            }
          ],
          
          successTips: [
            "Start with something you actually care about",
            "Use at least 2 different AI tools",
            "Don't worry if it's not perfect - focus on learning!",
            "Ask for help if you get stuck"
          ]
        },
        
        intermediate: {
          introduction: "Apply your AI skills to solve meaningful challenges that demonstrate professional-level competency and creative problem-solving.",
          
          professionalChallenges: [
            {
              domain: "Business Solutions",
              projects: [
                "Create a complete marketing campaign for a local business",
                "Design an onboarding process for new employees", 
                "Develop a customer feedback analysis system"
              ],
              skills: ["Strategic thinking", "Multi-tool coordination", "Professional communication"]
            },
            {
              domain: "Educational Innovation",
              projects: [
                "Design an AI-enhanced learning experience for a specific skill",
                "Create adaptive study materials for different learning styles",
                "Develop a peer tutoring support system"
              ],
              skills: ["Instructional design", "Personalization", "Assessment creation"]
            },
            {
              domain: "Creative Production",
              projects: [
                "Produce a short documentary using AI tools for research, scripting, and visuals",
                "Create a multimedia art installation concept",
                "Design an interactive storytelling experience"
              ],
              skills: ["Creative direction", "Technical integration", "Audience engagement"]
            }
          ],
          
          evaluationCriteria: [
            "Problem definition and understanding",
            "Tool selection and integration",
            "Quality of outputs and refinement",
            "Innovation and creative application",
            "Practical value and implementation potential"
          ]
        },
        
        advanced: {
          introduction: "Tackle complex, multi-faceted challenges that require sophisticated AI integration, strategic thinking, and innovative solutions.",
          
          masteryChallenges: [
            {
              challenge: "AI-Powered Business Transformation",
              scope: "Design comprehensive AI integration strategy for an organization",
              complexity: [
                "Multi-departmental impact analysis",
                "Technology stack evaluation",
                "Change management planning",
                "ROI modeling and risk assessment"
              ],
              deliverables: [
                "Strategic roadmap with implementation phases",
                "Pilot project specifications",
                "Training and adoption framework",
                "Success metrics and monitoring plan"
              ]
            },
            {
              challenge: "Social Impact AI Solution",
              scope: "Create AI-powered solution for a societal challenge",
              complexity: [
                "Stakeholder analysis and engagement",
                "Ethical considerations and bias mitigation",
                "Scalability and sustainability planning",
                "Impact measurement framework"
              ],
              deliverables: [
                "Problem analysis and solution design",
                "Technical architecture and implementation plan",
                "Ethical framework and safeguards",
                "Pilot deployment strategy"
              ]
            },
            {
              challenge: "Next-Generation Learning Platform",
              scope: "Design revolutionary educational experience using cutting-edge AI",
              complexity: [
                "Personalization at scale",
                "Multi-modal content generation",
                "Adaptive assessment systems",
                "Community and collaboration features"
              ],
              deliverables: [
                "Platform architecture and user experience design",
                "AI integration specifications",
                "Content generation and curation framework",
                "Pilot implementation and validation plan"
              ]
            }
          ],
          
          masteryIndicators: [
            "Systems thinking and holistic problem approach",
            "Innovative application of multiple AI technologies",
            "Consideration of ethical, social, and economic implications",
            "Scalable and sustainable solution design",
            "Clear communication of complex technical concepts"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'capstone_showcase',
        
        beginner: {
          instructions: "Choose your challenge and show your work! Document your process and celebrate what you create.",
          framework: [
            "1. Pick a challenge that excites you",
            "2. Plan your approach and tools",
            "3. Create your solution step by step",
            "4. Share what you learned and what you made"
          ],
          support: [
            "Guided prompts for each challenge type",
            "Example workflows and templates",
            "Encouragement and celebration of efforts"
          ]
        },
        
        intermediate: {
          instructions: "Demonstrate professional-level AI application through a comprehensive project. Focus on quality, innovation, and practical value.",
          requirements: [
            "Clear problem definition and solution approach",
            "Integration of multiple AI tools and techniques",
            "Professional-quality deliverables",
            "Reflection on process and lessons learned"
          ],
          evaluation: [
            "Technical execution and tool mastery",
            "Creative problem-solving approach",
            "Quality and completeness of solution",
            "Professional presentation and documentation"
          ]
        },
        
        advanced: {
          instructions: "Showcase mastery through an innovative, complex solution that demonstrates deep understanding of AI capabilities and limitations.",
          standards: [
            "Original thinking and novel applications",
            "Sophisticated technical integration",
            "Comprehensive consideration of implications",
            "Scalable and implementable solutions"
          ],
          portfolio: [
            "Executive summary and strategic overview",
            "Technical specifications and architecture",
            "Implementation roadmap and resource requirements",
            "Impact assessment and success metrics"
          ]
        }
      },
      
      xpRewards: { beginner: 50, intermediate: 75, advanced: 100 },
      estimatedTime: { beginner: 20, intermediate: 20, advanced: 20 }
    }
  ],

  // Vibe Coding lessons
  'interactive-coding': [
    {
      id: 'vibe-code-video-game',
      title: 'Vibe Coding a Video Game',
      lessonType: 'interactive_coding_with_ai',
      order: 1,
      
      coreConcept: "Create playable browser games using natural language prompts and AI. Learn the art of 'vibe coding' where you describe your game idea and let GPT-4o turn it into working HTML and JavaScript code.",
      
      content: {
        beginner: {
          introduction: "In this lesson, you'll explore 'vibe coding'—a creative approach to coding where you describe a game idea and let GPT-4o turn it into a working game using HTML and JavaScript. This technique is great for learning how code becomes interactive content, prototyping game ideas, or creating engaging learning games quickly.",
          
          mainContent: {
            concept: "Vibe coding lets you focus on creativity and game design while AI handles the technical implementation. You describe what you want, and AI creates the code.",
            
            realWorldApplication: "This technique is perfect for rapid prototyping, educational games, creative projects, and learning how interactive content works.",
            
            keySkills: [
              "Descriptive prompt writing for game mechanics",
              "Understanding basic game structure (player, controls, objectives)",
              "Iterative development through prompt refinement",
              "Safe code execution using iframe sandboxing"
            ],
            
            gameElements: [
              { element: "Player Character", description: "The main character you control", example: "A spaceship that moves with arrow keys" },
              { element: "Game Mechanics", description: "Rules and interactions", example: "Collecting coins increases your score" },
              { element: "Visual Elements", description: "What players see", example: "Colorful shapes, emoji graphics, backgrounds" },
              { element: "Win/Lose Conditions", description: "How the game ends", example: "Game over when you hit an obstacle" }
            ]
          },
          
          examples: [
            "A game where the player catches apples falling from the sky using arrow keys",
            "A simple platformer where you jump over obstacles with spacebar",
            "A maze game where you collect gems while avoiding enemies"
          ],
          
          exercises: [
            {
              title: "Exercise 1: Describe Your Game Idea",
              instructions: "Write a simple description of a game you'd like to create. Think about what the player does, how they control it, and what makes it fun.",
              example: "A game where the player catches apples falling from the sky using arrow keys. When you catch an apple, you get points. If you miss 3 apples, the game ends.",
              expectedOutcome: "A well-formed prompt for GPT-4o to interpret and turn into code",
              hints: [
                "Keep it simple for your first game",
                "Think about movement (arrow keys, mouse, clicking)",
                "Include a goal or scoring system",
                "Mention visual style (colors, shapes, emoji)"
              ]
            },
            {
              title: "Exercise 2: Generate the Game",
              instructions: "Submit your prompt to GPT-4o. The AI will return a complete HTML document containing your game code.",
              example: "Copy your game description and ask GPT-4o to create a complete HTML game",
              expectedOutcome: "An interactive browser game displayed in an iframe on the page",
              hints: [
                "Be specific about what you want",
                "Ask for a complete HTML file with embedded CSS and JavaScript",
                "Mention that it should work in a browser"
              ]
            },
            {
              title: "Exercise 3: Iterate and Improve",
              instructions: "Try adjusting your prompt to add more difficulty, visual style, or new mechanics. See how small changes in your description create different games.",
              example: "Make the apples fall faster, add different colored apples worth different points, or change the character to a basket",
              expectedOutcome: "A new version of your game with updated features or style",
              hints: [
                "Try one change at a time",
                "Ask for specific improvements",
                "Experiment with visual themes (space, underwater, fantasy)",
                "Add sound effects or animations"
              ]
            }
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'ai_game_generator',
        
        beginner: {
          instructions: "Use the AI Game Generator to create your own browser games. Type your game idea in natural language and watch it come to life!",
          
          interface: {
            promptInput: {
              placeholder: "Describe your game idea... (e.g., 'A game where you catch falling stars with a basket')",
              maxLength: 250,
              validation: {
                required: true,
                minLength: 10,
                sanitization: true,
                allowedCharacters: "^[a-zA-Z0-9\\s\\.,!?'\"()\\-\\/]+$",
                blockedPatterns: [
                  "script", "javascript", "eval", "function", "onclick", "onload",
                  "<[^>]*>",
                  "javascript:", "data:", "vbscript:"
                ]
              },
              examples: [
                "A simple platformer where you jump over obstacles",
                "A game where you shoot bubbles at falling objects", 
                "A maze game where you collect gems while avoiding enemies",
                "A rhythm game where you hit spacebar in time with notes"
              ]
            },
            
            gamePreview: {
              type: 'iframe',
              sandbox: 'allow-scripts allow-pointer-lock',
              security: {
                noNetworkAccess: true,
                limitedDOM: true,
                csp: "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
              }
            }
          },
          
          promptTemplates: [
            {
              name: "Catching Game",
              template: "Create a game where the player controls a [character] that catches [falling objects] using [arrow keys/mouse]. The player gets [points] for each catch and loses when they miss [number] objects."
            },
            {
              name: "Avoiding Game", 
              template: "Make a game where a [character] moves around the screen avoiding [obstacles]. The player controls it with [arrow keys/WASD] and the goal is to survive as long as possible."
            },
            {
              name: "Collecting Game",
              template: "Design a game where the player moves a [character] around to collect [items] while avoiding [enemies/obstacles]. Use [control method] for movement."
            }
          ],
          
          aiIntegration: {
            model: 'gpt-4o',
            systemPrompt: "You are a game development AI. Create complete, playable HTML games based on user descriptions. Include all HTML, CSS, and JavaScript in a single file. Make games simple but engaging, using canvas or DOM elements. Include basic graphics using CSS or simple shapes. Add clear instructions and scoring. IMPORTANT: Only generate safe, educational game content. Do not include any external links, network requests, or potentially harmful code.",
            
            inputSanitization: {
              maxLength: 250,
              stripHTML: true,
              escapeSpecialChars: true,
              blockedTerms: ['script', 'eval', 'function', 'onclick', 'onload', 'javascript:', 'data:', 'vbscript:']
            }
          }
        }
      },
      
      assessment: {
        beginner: [
          {
            question: "What is 'vibe coding' in the context of game development?",
            options: [
              "Writing code while listening to music",
              "Describing what you want and letting AI create the code",
              "Coding very quickly without planning"
            ],
            correct: "Describing what you want and letting AI create the code",
            explanation: "Vibe coding means focusing on the creative vision while AI handles the technical implementation."
          },
          {
            question: "Why do we use an iframe to display the generated games?",
            options: [
              "To make the games load faster",
              "To keep the games safe and contained",
              "To make the games look better"
            ],
            correct: "To keep the games safe and contained", 
            explanation: "Iframes with sandbox attributes prevent the game code from accessing or affecting the main page."
          },
          {
            question: "What makes a good game prompt for AI?",
            options: [
              "Very technical programming terms",
              "A clear description of player actions and goals",
              "Only mentioning the visual design"
            ],
            correct: "A clear description of player actions and goals",
            explanation: "AI works best when you describe what the player does, how they control the game, and what the objective is."
          }
        ]
      },
      
      xpRewards: { beginner: 50, intermediate: 60, advanced: 75 },
      estimatedTime: { beginner: 15, intermediate: 18, advanced: 20 },
      
      // Premium lesson metadata
      isPremium: true,
      category: 'Creative Coding',
      tags: ['game-development', 'ai-coding', 'javascript', 'html', 'creative'],
      difficulty: 'beginner'
    }
  ]
};

export default {
  promptEngineeringMasteryPath,
  adaptiveModules,
  adaptiveLessons
}; 

/**
 * Utility functions to access and convert adaptive lesson data
 */

// Get a lesson by ID from any module
export const getAdaptiveLessonById = (lessonId) => {
  for (const moduleId in adaptiveLessons) {
    const lessons = adaptiveLessons[moduleId];
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  return null;
};

// Convert adaptive lesson data to slide format for LessonViewer
export const convertAdaptiveLessonToSlides = (lesson, difficulty = 'intermediate') => {
  if (!lesson) return [];
  
  const slides = [];
  const difficultyContent = lesson.content[difficulty] || lesson.content.intermediate || lesson.content.beginner;
  
  // Skip "What to Expect" intro slides - users don't want to see lesson expectations
  // Go straight to actual lesson content

  // Special comprehensive handling for vocabulary lessons
  if (lesson.lessonType === 'interactive_vocabulary' && difficultyContent.vocabulary) {
    // Create detailed teaching slides for each vocabulary term
    difficultyContent.vocabulary.forEach((term, index) => {
      // Main teaching slide for each term
      slides.push({
        id: `${lesson.id}-vocab-teach-${index}`,
        type: 'interactive_teaching',
        content: {
          title: `Key Term: ${term.term}`,
          term: term.term,
          definition: term.definition,
          whatItMeans: term.whatItMeans,
          example: term.example,
          category: term.category,
          icon: getIconForCategory(term.category),
          explanation: `Let's learn about "${term.term}" - an important AI concept.`,
          progressInfo: `Term ${index + 1} of ${difficultyContent.vocabulary.length}`
        }
      });

      // Interactive definition matching slide every few terms
      if ((index + 1) % 4 === 0 || index === difficultyContent.vocabulary.length - 1) {
        const recentTerms = difficultyContent.vocabulary.slice(Math.max(0, index - 3), index + 1);
        slides.push({
          id: `${lesson.id}-vocab-check-${index}`,
          type: 'interactive_check',
          content: {
            title: "Quick Knowledge Check",
            explanation: "Let's review what you just learned! Fill in the blanks by clicking the correct terms.",
            fillInBlanks: recentTerms.map(t => ({
              sentence: `${t.definition.replace(t.term, '______')}`,
              correctAnswer: t.term,
              options: recentTerms.map(rt => rt.term).sort(() => Math.random() - 0.5)
            }))
          }
        });
      }
    });

    // Category summary slides
    const categories = [...new Set(difficultyContent.vocabulary.map(v => v.category))];
    categories.forEach(category => {
      const categoryTerms = difficultyContent.vocabulary.filter(v => v.category === category);
      slides.push({
        id: `${lesson.id}-category-${category.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'concept',
        content: {
          title: `${category} Terms`,
          explanation: `Here are all the ${category.toLowerCase()} terms you've learned:`,
          icon: getIconForCategory(category),
          keyPoints: categoryTerms.map(term => `${term.term}: ${term.whatItMeans}`),
          vocabulary: categoryTerms
        }
      });
    });
  }

  // Enhanced handling for all other lesson types
  else {
    // Create comprehensive content based on lesson structure
    createComprehensiveLessonSlides(lesson, difficultyContent, slides);
  }

  // Add assessment questions as quiz slides
  if (lesson.assessment && lesson.assessment[difficulty]) {
    lesson.assessment[difficulty].forEach((question, index) => {
      slides.push({
        id: `${lesson.id}-quiz-${index}`,
        type: 'quiz',
        content: {
          question: question.question,
          options: question.options.map(opt => ({ 
            text: typeof opt === 'string' ? opt : opt.text, 
            correct: typeof opt === 'string' ? opt === question.correct : opt.correct 
          })),
          explanation: question.explanation
        }
      });
    });
  }

  // Add sandbox slide ONLY for 'vibe-code-video-game' lesson
  if (lesson.id === 'vibe-code-video-game' && lesson.sandbox?.required) {
    const sandboxContent = lesson.sandbox[difficulty] || lesson.sandbox.beginner;
    if (sandboxContent && (sandboxContent.exercises || sandboxContent.scenarios)) {
        slides.push({
            id: `${lesson.id}-sandbox`,
            type: 'sandbox',
            content: {
                title: sandboxContent.title || "Practice What You've Learned",
                instructions: sandboxContent.instructions || "Try out the concepts from this lesson!",
                ...sandboxContent,
                exercises: sandboxContent.exercises || sandboxContent.scenarios || []
            }
        });
    }
  }

  return slides;
};

// Comprehensive lesson slide creation for all lesson types
const createComprehensiveLessonSlides = (lesson, difficultyContent, slides) => {
  const lessonId = lesson.id;
  
  // Handle specific lesson types with their unique content structures
  switch (lessonId) {
    case 'prompting-essentials':
      createPromptingEssentialsSlides(lesson, difficultyContent, slides);
      break;
    case 'prompt-engineering-action':
      createPromptEngineeringActionSlides(lesson, difficultyContent, slides);
      break;
    case 'creative-ai-mastery':
      createCreativeAiMasterySlides(lesson, difficultyContent, slides);
      break;
    case 'ai-workflow-fundamentals':
      createWorkflowFundamentalsSlides(lesson, difficultyContent, slides);
      break;
    case 'ai-daily-applications':
      createDailyApplicationsSlides(lesson, difficultyContent, slides);
      break;
    case 'local-ai-mastery':
      createLocalAiMasterySlides(lesson, difficultyContent, slides);
      break;
    case 'ai-problem-solving-capstone':
      createProblemSolvingCapstoneSlides(lesson, difficultyContent, slides);
      break;
    case 'welcome-ai-revolution':
      createWelcomeAiRevolutionSlides(lesson, difficultyContent, slides);
      break;
    case 'how-ai-thinks':
      createHowAiThinksSlides(lesson, difficultyContent, slides);
      break;
    default:
      // Generic comprehensive content creation
      createGenericComprehensiveSlides(lesson, difficultyContent, slides);
      break;
  }
};

// Prompting Essentials lesson slides
const createPromptingEssentialsSlides = (lesson, difficultyContent, slides) => {
  // Core concept introduction
  slides.push({
    id: `${lesson.id}-concept-intro`,
    type: 'concept',
    content: {
      title: "What Makes a Good Prompt?",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: [
        "Prompts are your steering wheel for AI",
        "Clear instructions lead to better results",
        "Structure helps AI understand what you want"
      ]
    }
  });

  // Prompt elements teaching
  if (difficultyContent.promptElements || difficultyContent.promptFramework) {
    const elements = difficultyContent.promptElements || difficultyContent.promptFramework || [];
    elements.forEach((element, index) => {
      slides.push({
        id: `${lesson.id}-element-${index}`,
        type: 'interactive_teaching',
        content: {
          title: `Element ${index + 1}: ${element.element || element.component}`,
          explanation: element.description || `Learn about ${element.element || element.component} in prompts.`,
          term: element.element || element.component,
          definition: element.description,
          whatItMeans: element.example || element.description,
          example: element.example,
          category: "Prompt Elements",
          icon: "✍️",
          progressInfo: `Element ${index + 1} of ${elements.length}`
        }
      });
    });

         // Interactive practice after learning elements
     slides.push({
       id: `${lesson.id}-elements-practice`,
       type: 'interactive_check',
       content: {
         title: "Practice Prompt Elements",
         explanation: "Fill in the blanks to complete these prompting principles:",
         fillInBlanks: [
           {
             sentence: "To write effective prompts, you should be ______ about what you want AI to do.",
             correctAnswer: "specific",
             options: ["specific", "vague", "brief", "creative"]
           },
           {
             sentence: "Good prompts provide ______ to help AI understand the situation.",
             correctAnswer: "context",
             options: ["context", "questions", "commands", "confusion"]
           },
           {
             sentence: "When you want structured output, you should ______ the format you need.",
             correctAnswer: "specify",
             options: ["specify", "ignore", "assume", "guess"]
           }
         ]
       }
     });
  }

  // Example comparisons (weak vs strong prompts)
  if (difficultyContent.examples) {
    difficultyContent.examples.forEach((example, index) => {
      // Weak prompt slide
      slides.push({
        id: `${lesson.id}-weak-example-${index}`,
        type: 'example',
        content: {
          title: `❌ Weak Prompt Example ${index + 1}`,
          example: example.weak,
          explanation: "This prompt is too vague and doesn't give the AI enough guidance.",
          icon: "❌"
        }
      });

      // Strong prompt slide
      slides.push({
        id: `${lesson.id}-strong-example-${index}`,
        type: 'example',
        content: {
          title: `✅ Strong Prompt Example ${index + 1}`,
          example: example.strong,
          explanation: example.why || "This prompt is specific, clear, and gives the AI helpful context.",
          icon: "✅"
        }
      });

             // Interactive comparison
       slides.push({
         id: `${lesson.id}-comparison-${index}`,
         type: 'interactive_check',
         content: {
           title: "Why is the Strong Prompt Better?",
           explanation: "Complete this explanation:",
           fillInBlanks: [{
             sentence: "The strong prompt works better because it ______",
             correctAnswer: "gives specific details",
             options: ["gives specific details", "uses fancy words", "is much longer", "sounds more formal"]
           }]
         }
       });
    });
  }

  // Final review and practice
  slides.push({
    id: `${lesson.id}-final-practice`,
    type: 'interactive_check',
    content: {
      title: "Put It All Together",
      explanation: "Complete these sentences about effective prompting:",
      fillInBlanks: [
        {
          sentence: "The most important thing in prompting is to be ______ about what you want.",
          correctAnswer: "specific",
          options: ["specific", "general", "creative", "brief"]
        },
        {
          sentence: "Good prompts provide ______ to help the AI understand the situation.",
          correctAnswer: "context",
          options: ["context", "questions", "examples", "commands"]
        },
        {
          sentence: "When you want the AI to format output in a certain way, you should ______ the format.",
          correctAnswer: "specify",
          options: ["specify", "guess", "ignore", "assume"]
        }
      ]
    }
  });
};

// Prompt Engineering Action lesson slides
const createPromptEngineeringActionSlides = (lesson, difficultyContent, slides) => {
  // Introduction to advanced techniques
  slides.push({
    id: `${lesson.id}-advanced-intro`,
    type: 'concept',
    content: {
      title: "Advanced Prompting Techniques",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: [
        "Prompt engineering is a craft that improves with practice",
        "Advanced techniques help you get consistent, high-quality results",
        "Examples, structure, and step-by-step logic are powerful tools"
      ]
    }
  });

  // Techniques deep dive
  if (difficultyContent.techniques) {
    difficultyContent.techniques.forEach((technique, index) => {
      // Technique introduction
      slides.push({
        id: `${lesson.id}-technique-${index}`,
        type: 'interactive_teaching',
        content: {
          title: technique.name,
          explanation: `Master the ${technique.name} technique for better AI results.`,
          term: technique.name,
          definition: technique.description,
          whatItMeans: technique.description,
          example: technique.example || technique.structure,
          category: "Advanced Techniques",
          icon: "⚡",
          progressInfo: `Technique ${index + 1} of ${difficultyContent.techniques.length}`
        }
      });

             // Interactive practice for each technique  
       slides.push({
         id: `${lesson.id}-technique-practice-${index}`,
         type: 'interactive_check',
         content: {
           title: `Practice: ${technique.name}`,
           explanation: "Complete this technique application:",
           fillInBlanks: [{
             sentence: getTechniquePracticeSentence(technique.name),
             correctAnswer: getTechniqueAnswer(technique.name),
             options: getTechniqueOptions(technique.name),
             explanation: technique.description
           }]
         }
       });
    });
  }

  // Real-world applications
  slides.push({
    id: `${lesson.id}-applications`,
    type: 'concept',
    content: {
      title: "Real-World Applications",
      explanation: "These techniques work great for business, creative projects, and personal use.",
      icon: "🌍",
      keyPoints: [
        "Business: Creating consistent marketing content",
        "Creative: Generating ideas with specific styles",
        "Personal: Getting help with complex decisions",
        "Learning: Breaking down difficult concepts"
      ]
    }
  });

  // Advanced practice scenarios
  slides.push({
    id: `${lesson.id}-scenarios`,
    type: 'interactive_check',
    content: {
      title: "Advanced Scenarios",
      explanation: "Choose the best technique for each situation:",
      fillInBlanks: [
        {
          sentence: "To teach AI a specific writing style, you should use ______",
          correctAnswer: "few-shot examples",
          options: ["few-shot examples", "simple commands", "longer prompts", "multiple questions"]
        },
        {
          sentence: "For complex problem-solving, ask the AI to think ______",
          correctAnswer: "step by step",
          options: ["step by step", "very quickly", "creatively", "differently"]
        },
        {
          sentence: "To improve a response that's almost right, you should ______",
          correctAnswer: "iterate and refine",
          options: ["iterate and refine", "start over", "accept it", "make it shorter"]
        }
      ]
    }
  });
};

// Creative AI Mastery lesson slides
const createCreativeAiMasterySlides = (lesson, difficultyContent, slides) => {
  // Introduction to creative AI
  slides.push({
    id: `${lesson.id}-creative-intro`,
    type: 'concept',
    content: {
      title: "AI as Your Creative Partner",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: [
        "AI can create images, videos, and voices from text descriptions",
        "Creative AI opens up new possibilities for personal and professional projects",
        "The key is learning how to describe what you want clearly"
      ]
    }
  });

  // Tools overview
  if (difficultyContent.tools || difficultyContent.toolCategories) {
    const tools = difficultyContent.tools || difficultyContent.toolCategories || [];
    tools.forEach((tool, index) => {
             slides.push({
         id: `${lesson.id}-tool-${index}`,
         type: 'interactive_teaching',
         content: {
           title: tool.type || tool.category,
           explanation: `Learn about ${tool.type || tool.category} and how to use it effectively.`,
           term: tool.type || tool.category,
           definition: tool.description,
           whatItMeans: getSimplifiedExplanation(tool.type || tool.category, tool.description),
           example: tool.example || getToolExample(tool.type || tool.category),
           category: "Creative AI Tools",
           icon: tool.icon || "🎨",
           progressInfo: `Tool ${index + 1} of ${tools.length}`
         }
       });

      // Interactive application practice
      if (tool.applications || tool.personalUse) {
        slides.push({
          id: `${tool.type?.toLowerCase().replace(/\s+/g, '-') || tool.category?.toLowerCase().replace(/\s+/g, '-')}-practice`,
          type: 'interactive_check',
          content: {
            title: `${tool.type || tool.category} Applications`,
            explanation: "What would you use this tool for?",
            fillInBlanks: [{
              sentence: `${tool.type || tool.category} is perfect for ______`,
              correctAnswer: tool.personalUse?.split(',')[0] || tool.applications?.[0] || "creative projects",
              options: [
                tool.personalUse?.split(',')[0] || tool.applications?.[0] || "creative projects",
                "writing code",
                "solving math problems",
                "reading emails"
              ].sort(() => Math.random() - 0.5)
            }]
          }
        });
      }
    });
  }

  // Prompting tips for creative AI
  if (difficultyContent.promptingTips || difficultyContent.bestPractices) {
    const tips = difficultyContent.promptingTips || difficultyContent.bestPractices || [];
    slides.push({
      id: `${lesson.id}-prompting-tips`,
      type: 'concept',
      content: {
        title: "Creative AI Prompting Tips",
        explanation: "Master these tips to get amazing results from creative AI tools.",
        icon: "💡",
        keyPoints: tips
      }
    });

    // Interactive prompting practice
    slides.push({
      id: `${lesson.id}-prompting-practice`,
      type: 'interactive_check',
      content: {
        title: "Craft Better Creative Prompts",
        explanation: "Complete these creative prompting principles:",
        fillInBlanks: [
          {
            sentence: "For AI art, you should be ______ about colors, style, and mood.",
            correctAnswer: "descriptive",
            options: ["descriptive", "brief", "vague", "technical"]
          },
          {
            sentence: "When creating videos with AI, mention the ______ movement and style.",
            correctAnswer: "camera",
            options: ["camera", "audio", "text", "background"]
          },
          {
            sentence: "For voice AI, specify the ______ and emotional tone you want.",
            correctAnswer: "personality",
            options: ["personality", "volume", "speed", "accent"]
          }
        ]
      }
    });
  }

  // Real project examples
  slides.push({
    id: `${lesson.id}-project-examples`,
    type: 'concept',
    content: {
      title: "Real Creative Projects",
      explanation: "See how people use creative AI for amazing projects!",
      icon: "🌟",
      keyPoints: [
        "Social media creators make custom artwork for their brand",
        "Students create unique presentation visuals",
        "Families make personalized birthday cards and invitations",
        "Small businesses design marketing materials on a budget",
        "Hobbyists bring their creative ideas to life"
      ]
    }
  });
};

// AI Workflow Fundamentals lesson slides
const createWorkflowFundamentalsSlides = (lesson, difficultyContent, slides) => {
  // Workflow concept introduction
  slides.push({
    id: `${lesson.id}-workflow-intro`,
    type: 'concept',
    content: {
      title: "Thinking in Workflows",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: [
        "Workflows break complex tasks into manageable steps",
        "Each AI tool is good at specific things",
        "Combining tools creates powerful solutions"
      ]
    }
  });

  // Simple workflow examples
  if (difficultyContent.simpleWorkflows || difficultyContent.businessWorkflows) {
    const workflows = difficultyContent.simpleWorkflows || difficultyContent.businessWorkflows || [];
    workflows.forEach((workflow, index) => {
      // Workflow introduction
      slides.push({
        id: `${lesson.id}-workflow-${index}`,
        type: 'interactive_teaching',
        content: {
          title: workflow.name,
          explanation: `Learn how to create a ${workflow.name} using multiple AI tools.`,
          term: workflow.name,
          definition: workflow.steps ? workflow.steps.join(' → ') : "A step-by-step process using AI tools",
          whatItMeans: `Breaking ${workflow.name.toLowerCase()} into simple steps that AI tools can handle`,
          example: workflow.result || workflow.benefits?.[0] || "A complete solution using multiple AI tools",
          category: "AI Workflows",
          icon: "🔄",
          progressInfo: `Workflow ${index + 1} of ${workflows.length}`
        }
      });

      // Interactive step building
      if (workflow.steps) {
        slides.push({
          id: `${lesson.id}-workflow-steps-${index}`,
          type: 'interactive_check',
          content: {
            title: `Build the ${workflow.name} Workflow`,
            explanation: "Put the steps in the right order:",
            fillInBlanks: workflow.steps.slice(0, 3).map((step, stepIndex) => ({
              sentence: `Step ${stepIndex + 1}: ${step.replace(/^\d+\.?\s*/, '').split(' ')[0]} ______`,
              correctAnswer: step.replace(/^\d+\.?\s*/, '').split(' ').slice(1, 3).join(' '),
              options: [
                step.replace(/^\d+\.?\s*/, '').split(' ').slice(1, 3).join(' '),
                "randomly",
                "quickly",
                "manually"
              ].sort(() => Math.random() - 0.5)
            }))
          }
        });
      }
    });
  }

  // Workflow principles
  if (difficultyContent.workflowPrinciples) {
    slides.push({
      id: `${lesson.id}-principles`,
      type: 'concept',
      content: {
        title: "Workflow Design Principles",
        explanation: "Follow these principles to create effective AI workflows.",
        icon: "🎯",
        keyPoints: difficultyContent.workflowPrinciples
      }
    });
  }

  // Practice designing workflows
  slides.push({
    id: `${lesson.id}-design-practice`,
    type: 'interactive_check',
    content: {
      title: "Design Your Own Workflow",
      explanation: "Complete these workflow design principles:",
      fillInBlanks: [
        {
          sentence: "When designing workflows, start by identifying your ______ goal.",
          correctAnswer: "end",
          options: ["end", "first", "hardest", "easiest"]
        },
        {
          sentence: "Choose the ______ tool for each specific task in your workflow.",
          correctAnswer: "right",
          options: ["right", "fastest", "cheapest", "newest"]
        },
        {
          sentence: "Make sure outputs from one step ______ into the next step effectively.",
          correctAnswer: "feed",
          options: ["feed", "jump", "copy", "transform"]
        }
      ]
    }
  });
};

// AI Daily Applications lesson slides
const createDailyApplicationsSlides = (lesson, difficultyContent, slides) => {
  // Introduction to daily AI use
  slides.push({
    id: `${lesson.id}-daily-intro`,
    type: 'concept',
    content: {
      title: "AI as Your Daily Assistant",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: [
        "AI can help with school, work, and personal life",
        "The key is knowing when and how to use AI effectively",
        "Start small and build AI into your daily routines"
      ]
    }
  });

  // Application categories
  if (difficultyContent.schoolHelp || difficultyContent.categories) {
    const categories = difficultyContent.categories || [
      { area: "School", applications: difficultyContent.schoolHelp || [] },
      { area: "Home", applications: difficultyContent.homeHelp || [] },
      { area: "Personal Growth", applications: difficultyContent.personalGrowth || [] }
    ];

    categories.forEach((category, index) => {
      if (category.applications && category.applications.length > 0) {
        slides.push({
          id: `${lesson.id}-category-${index}`,
          type: 'interactive_teaching',
          content: {
            title: `AI for ${category.area || category.category}`,
            explanation: `Discover how AI can help with your ${(category.area || category.category).toLowerCase()} activities.`,
            term: `AI for ${category.area || category.category}`,
            definition: `Using AI tools to improve your ${(category.area || category.category).toLowerCase()} experience`,
            whatItMeans: `Getting AI help with daily ${(category.area || category.category).toLowerCase()} tasks and challenges`,
            example: category.applications[0],
            category: "Daily Applications",
            icon: category.area === "School" ? "📚" : category.area === "Home" ? "🏠" : "💪",
            progressInfo: `Category ${index + 1} of ${categories.length}`
          }
        });

        // Interactive application matching
        slides.push({
          id: `${lesson.id}-${category.area?.toLowerCase() || category.category?.toLowerCase()}-practice`,
          type: 'interactive_check',
          content: {
            title: `${category.area || category.category} AI Applications`,
            explanation: `Match these ${(category.area || category.category).toLowerCase()} tasks with AI solutions:`,
            fillInBlanks: category.applications.slice(0, 3).map(app => ({
              sentence: `To "${app.toLowerCase()}", you could use AI to ______`,
              correctAnswer: "help and guide you",
              options: ["help and guide you", "do it completely", "make it harder", "avoid the task"]
            }))
          }
        });
      }
    });
  }

  // Simple prompts for daily use
  if (difficultyContent.simplePrompts) {
    slides.push({
      id: `${lesson.id}-simple-prompts`,
      type: 'concept',
      content: {
        title: "Simple Daily Prompts",
        explanation: "Use these proven prompt templates for common daily tasks.",
        icon: "💬",
        keyPoints: difficultyContent.simplePrompts
      }
    });

    // Interactive prompt building
    slides.push({
      id: `${lesson.id}-prompt-building`,
      type: 'interactive_check',
      content: {
        title: "Build Effective Daily Prompts",
        explanation: "Complete these daily prompt templates:",
        fillInBlanks: [
          {
            sentence: "To get simple explanations, start with 'Explain ______ like I'm 10 years old'",
            correctAnswer: "[topic]",
            options: ["[topic]", "everything", "quickly", "simply"]
          },
          {
            sentence: "For planning help, ask 'Help me make a ______ of things to do for [activity]'",
            correctAnswer: "list",
            options: ["list", "story", "picture", "song"]
          },
          {
            sentence: "To learn about topics, ask 'What are ______ fun ways to learn about [subject]?'",
            correctAnswer: "3",
            options: ["3", "many", "some", "all"]
          }
        ]
      }
    });
  }

  // Real success stories
  slides.push({
    id: `${lesson.id}-success-stories`,
    type: 'concept',
    content: {
      title: "Real Success Stories",
      explanation: "See how people are already using AI to improve their daily lives!",
      icon: "⭐",
      keyPoints: [
        "Students improve grades by getting AI tutoring help",
        "Parents save hours each week with AI meal planning",
        "Professionals learn new skills faster with AI guidance",
        "Families create better memories with AI trip planning",
        "People achieve personal goals with AI coaching support"
      ]
    }
  });
};

// Local AI Mastery lesson slides
const createLocalAiMasterySlides = (lesson, difficultyContent, slides) => {
  // Why local AI matters
  slides.push({
    id: `${lesson.id}-why-local`,
    type: 'concept',
    content: {
      title: "Why Run AI Locally?",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: difficultyContent.whyLocal || [
        "Complete privacy - your data stays on your device",
        "No internet required - works anywhere",
        "No monthly fees - one-time setup",
        "No usage limits - use as much as you want"
      ]
    }
  });

  // Benefits deep dive
  if (difficultyContent.benefits) {
    difficultyContent.benefits.forEach((benefit, index) => {
      slides.push({
        id: `${lesson.id}-benefit-${index}`,
        type: 'interactive_teaching',
        content: {
          title: benefit.benefit,
          explanation: `Understand why ${benefit.benefit.toLowerCase()} matters for local AI.`,
          term: benefit.benefit,
          definition: benefit.description,
          whatItMeans: benefit.importance,
          example: benefit.importance,
          category: "Local AI Benefits",
          icon: "💻",
          progressInfo: `Benefit ${index + 1} of ${difficultyContent.benefits.length}`
        }
      });
    });

    // Interactive benefits matching
    slides.push({
      id: `${lesson.id}-benefits-practice`,
      type: 'interactive_check',
      content: {
        title: "Match the Benefits",
        explanation: "Why would you choose local AI for these situations?",
        fillInBlanks: difficultyContent.benefits.slice(0, 3).map(benefit => ({
          sentence: `For ${benefit.importance?.toLowerCase() || benefit.benefit.toLowerCase()}, local AI provides ______`,
          correctAnswer: benefit.benefit.toLowerCase(),
          options: [
            benefit.benefit.toLowerCase(),
            "slower performance",
            "higher costs",
            "less control"
          ].sort(() => Math.random() - 0.5)
        }))
      }
    });
  }

  // Popular tools overview
  if (difficultyContent.popularTools || difficultyContent.simpleOptions) {
    const tools = difficultyContent.popularTools || difficultyContent.simpleOptions || [];
    tools.forEach((tool, index) => {
      slides.push({
        id: `${lesson.id}-tool-${index}`,
        type: 'interactive_teaching',
        content: {
          title: tool.tool || tool.name,
          explanation: `Learn about ${tool.tool || tool.name} and how to get started.`,
          term: tool.tool || tool.name,
          definition: tool.description,
          whatItMeans: tool.description,
          example: tool.useCase || tool.difficulty,
          category: "Local AI Tools",
          icon: "🛠️",
          progressInfo: `Tool ${index + 1} of ${tools.length}`
        }
      });
    });
  }

  // Getting started guide
  if (difficultyContent.whatYouNeed) {
    slides.push({
      id: `${lesson.id}-getting-started`,
      type: 'concept',
      content: {
        title: "What You Need to Get Started",
        explanation: "Here's what you need to run AI on your own computer.",
        icon: "🚀",
        keyPoints: difficultyContent.whatYouNeed
      }
    });
  }

  // Considerations and planning
  if (difficultyContent.considerations) {
    slides.push({
      id: `${lesson.id}-considerations`,
      type: 'interactive_check',
      content: {
        title: "Planning Your Local AI Setup",
        explanation: "Consider these important factors:",
        fillInBlanks: [
          {
            sentence: "Choose models based on ______ vs performance tradeoffs.",
            correctAnswer: "size",
            options: ["size", "color", "age", "brand"]
          },
          {
            sentence: "Consider your ______ requirements and available resources.",
            correctAnswer: "hardware",
            options: ["hardware", "software", "internet", "storage"]
          },
          {
            sentence: "Think about ______ complexity and ongoing maintenance needs.",
            correctAnswer: "setup",
            options: ["setup", "usage", "learning", "sharing"]
          }
        ]
      }
    });
  }
};

// Problem Solving Capstone lesson slides
const createProblemSolvingCapstoneSlides = (lesson, difficultyContent, slides) => {
  // Capstone introduction
  slides.push({
    id: `${lesson.id}-capstone-intro`,
    type: 'concept',
    content: {
      title: "Your AI Problem-Solving Challenge",
      explanation: difficultyContent.introduction,
      icon: getIconForLesson(lesson.id),
      keyPoints: [
        "Apply everything you've learned about AI",
        "Choose a real problem you want to solve",
        "Create a comprehensive solution using AI tools"
      ]
    }
  });

  // Challenge categories
  if (difficultyContent.challengeCategories) {
    difficultyContent.challengeCategories.forEach((category, index) => {
      slides.push({
        id: `${lesson.id}-category-${index}`,
        type: 'interactive_teaching',
        content: {
          title: category.category,
          explanation: `Explore ${category.category.toLowerCase()} project ideas for your capstone.`,
          term: category.category,
          definition: `Projects that focus on ${category.category.toLowerCase()}`,
          whatItMeans: `Using AI to create meaningful ${category.category.toLowerCase()}`,
          example: category.challenges?.[0] || `AI-powered ${category.category.toLowerCase()} solution`,
          category: "Capstone Categories",
          icon: "🎯",
          progressInfo: `Category ${index + 1} of ${difficultyContent.challengeCategories.length}`
        }
      });

      // Show specific challenges
      if (category.challenges) {
        slides.push({
          id: `${lesson.id}-challenges-${index}`,
          type: 'concept',
          content: {
            title: `${category.category} Project Ideas`,
            explanation: "Here are specific project ideas you could tackle:",
            icon: "💡",
            keyPoints: category.challenges
          }
        });
      }
    });

    // Project selection guidance
    slides.push({
      id: `${lesson.id}-selection-guidance`,
      type: 'interactive_check',
      content: {
        title: "Choose Your Project Wisely",
        explanation: "What makes a good capstone project?",
        fillInBlanks: [
          {
            sentence: "Choose a project you ______ care about for better motivation.",
            correctAnswer: "actually",
            options: ["actually", "never", "might", "should"]
          },
          {
            sentence: "Use at least ______ different AI tools in your solution.",
            correctAnswer: "2",
            options: ["2", "1", "10", "5"]
          },
          {
            sentence: "Focus on ______ rather than perfection in your first attempt.",
            correctAnswer: "learning",
            options: ["learning", "speed", "complexity", "winning"]
          }
        ]
      }
    });
  }

  // Success tips
  if (difficultyContent.successTips) {
    slides.push({
      id: `${lesson.id}-success-tips`,
      type: 'concept',
      content: {
        title: "Tips for Success",
        explanation: "Follow these tips to create an amazing capstone project.",
        icon: "⭐",
        keyPoints: difficultyContent.successTips
      }
    });
  }

  // Final motivation and next steps
  slides.push({
    id: `${lesson.id}-final-motivation`,
    type: 'concept',
    content: {
      title: "You're Ready to Create!",
      explanation: "You have all the tools and knowledge you need. Now it's time to build something amazing!",
      icon: "🚀",
      keyPoints: [
        "You've mastered AI vocabulary and concepts",
        "You know how to write effective prompts",
        "You understand how to combine AI tools",
        "You can apply AI to real-world problems",
        "Time to create your masterpiece!"
      ]
    }
  });
};

// Welcome AI Revolution lesson slides
const createWelcomeAiRevolutionSlides = (lesson, difficultyContent, slides) => {
  // Main content concept
  if (difficultyContent.mainContent) {
    const content = difficultyContent.mainContent;
    
    // AI definition deep dive
    slides.push({
      id: `${lesson.id}-ai-definition`,
      type: 'interactive_teaching',
      content: {
        title: "What is Artificial Intelligence?",
        explanation: "Let's break down what AI really means and how it works.",
        term: "Artificial Intelligence (AI)",
        definition: content.aiDefinition,
        whatItMeans: content.aiDefinition,
        example: "ChatGPT understanding and responding to your questions",
        category: "Core Concepts",
        icon: "🤖",
        progressInfo: "Core Concept 1 of 4"
      }
    });

    // AI vs Chatbots clarification
    slides.push({
      id: `${lesson.id}-ai-vs-chatbots`,
      type: 'interactive_teaching',
      content: {
        title: "AI vs Chatbots: What's the Difference?",
        explanation: "Understand the relationship between AI and chatbots.",
        term: "AI vs Chatbots",
        definition: content.aiVsChatbots,
        whatItMeans: content.aiVsChatbots,
        example: "ChatGPT is a chatbot powered by AI, but AI can also create images, videos, and more",
        category: "Core Concepts",
        icon: "🔍",
        progressInfo: "Core Concept 2 of 4"
      }
    });

    // Categories of AI
    if (content.categories) {
      content.categories.forEach((category, index) => {
        slides.push({
          id: `${lesson.id}-category-${index}`,
          type: 'interactive_teaching',
          content: {
            title: category.type,
            explanation: `Learn about ${category.type} and how you can use it.`,
            term: category.type,
            definition: category.description,
            whatItMeans: category.description,
            example: category.example || `Using ${category.type} for creative projects`,
            category: "AI Categories",
            icon: category.icon,
            progressInfo: `AI Type ${index + 1} of ${content.categories.length}`
          }
        });
      });

      // Interactive category matching
      slides.push({
        id: `${lesson.id}-category-matching`,
        type: 'interactive_check',
        content: {
          title: "Match AI Types to Uses",
          explanation: "What type of AI would you use for these tasks?",
          fillInBlanks: content.categories.slice(0, 3).map(category => ({
            sentence: `To ${category.example?.toLowerCase() || 'work with ' + category.type.toLowerCase()}, you would use ______`,
            correctAnswer: category.type,
            options: [
              category.type,
              ...content.categories.filter(c => c.type !== category.type).slice(0, 2).map(c => c.type)
            ].sort(() => Math.random() - 0.5)
          }))
        }
      });
    }

    // Major AI companies
    if (content.companies) {
      slides.push({
        id: `${lesson.id}-companies`,
        type: 'concept',
        content: {
          title: "Major AI Companies",
          explanation: "Get to know the companies creating the AI tools you'll use.",
          icon: "🏢",
          keyPoints: content.companies.map(company => 
            `${company.name}: ${company.tool || company.tools} - ${company.description}`
          )
        }
      });
    }
  }

  // Examples and applications
  if (difficultyContent.examples) {
    slides.push({
      id: `${lesson.id}-examples`,
      type: 'concept',
      content: {
        title: "AI in Your Daily Life",
        explanation: "Here are practical ways you can start using AI today!",
        icon: "🌟",
        keyPoints: difficultyContent.examples
      }
    });
  }

  // Common misunderstandings
  if (difficultyContent.commonMisunderstandings) {
    slides.push({
      id: `${lesson.id}-misconceptions`,
      type: 'interactive_check',
      content: {
        title: "Clear Up Common Misconceptions",
        explanation: "Let's fix these common misunderstandings about AI:",
        fillInBlanks: difficultyContent.commonMisunderstandings.map(misconception => {
          const parts = misconception.split(' → ');
          return {
            sentence: `It's wrong to think that ${parts[0].toLowerCase()}. Actually, ______`,
            correctAnswer: parts[1]?.split(' ')[0]?.toLowerCase() || "AI",
            options: [
              parts[1]?.split(' ')[0]?.toLowerCase() || "AI",
              "nothing",
              "everything",
              "sometimes"
            ].sort(() => Math.random() - 0.5),
            explanation: parts[1] || "This is a common misconception about AI."
          };
        })
      }
    });
  }
};

// How AI Thinks lesson slides
const createHowAiThinksSlides = (lesson, difficultyContent, slides) => {
  if (difficultyContent.mainContent) {
    const content = difficultyContent.mainContent;
    
    // Training process explanation
    slides.push({
      id: `${lesson.id}-training`,
      type: 'interactive_teaching',
      content: {
        title: "How AI Learns",
        explanation: "Discover how AI models are trained to understand and generate text.",
        term: "AI Training",
        definition: content.training,
        whatItMeans: content.training,
        example: "AI reads millions of books and websites to learn patterns in language",
        category: "How AI Works",
        icon: "📚",
        progressInfo: "Core Concept 1 of 3"
      }
    });

    // Tokens explanation
    slides.push({
      id: `${lesson.id}-tokens`,
      type: 'interactive_teaching',
      content: {
        title: "Understanding Tokens",
        explanation: "Learn how AI breaks down and processes text.",
        term: "Tokens",
        definition: content.tokens,
        whatItMeans: content.tokens,
        example: "The word 'wonderful' might be split into 'wonder' + 'ful' = 2 tokens",
        category: "How AI Works",
        icon: "🧩",
        progressInfo: "Core Concept 2 of 3"
      }
    });

    // Inference explanation
    slides.push({
      id: `${lesson.id}-inference`,
      type: 'interactive_teaching',
      content: {
        title: "How AI Generates Responses",
        explanation: "Understand how AI creates responses to your questions.",
        term: "AI Inference",
        definition: content.inference,
        whatItMeans: content.inference,
        example: "When you ask a question, AI predicts the most likely words to answer based on patterns it learned",
        category: "How AI Works",
        icon: "⚡",
        progressInfo: "Core Concept 3 of 3"
      }
    });

    // Technical concepts for intermediate/advanced
    if (content.technicalConcepts) {
      slides.push({
        id: `${lesson.id}-technical-concepts`,
        type: 'concept',
        content: {
          title: "Technical AI Concepts",
          explanation: "Understand these important technical aspects of how AI works.",
          icon: "🔧",
          keyPoints: content.technicalConcepts
        }
      });
    }

    // Practical implications
    if (content.practicalImplications || difficultyContent.practicalImplications) {
      const implications = content.practicalImplications || difficultyContent.practicalImplications;
      slides.push({
        id: `${lesson.id}-implications`,
        type: 'concept',
        content: {
          title: "What This Means for You",
          explanation: "Here's how understanding AI's thinking helps you use it better.",
          icon: "💡",
          keyPoints: implications
        }
      });
    }

    // Examples of AI pattern recognition
    if (difficultyContent.examples || content.examples) {
      const examples = difficultyContent.examples || content.examples;
      slides.push({
        id: `${lesson.id}-pattern-examples`,
        type: 'interactive_check',
        content: {
          title: "AI Pattern Recognition",
          explanation: "Complete these examples of how AI recognizes patterns:",
          fillInBlanks: examples.slice(0, 3).map(example => ({
            sentence: example.replace(/AI.*/, "AI guesses ______"),
            correctAnswer: "based on patterns",
            options: ["based on patterns", "randomly", "perfectly", "slowly"]
          }))
        }
      });
    }
  }

  // Key points summary
  if (difficultyContent.keyPoints) {
    slides.push({
      id: `${lesson.id}-key-points`,
      type: 'concept',
      content: {
        title: "Key Takeaways",
        explanation: "Remember these important points about how AI thinks:",
        icon: "🎯",
        keyPoints: difficultyContent.keyPoints
      }
    });
  }
};

// Generic comprehensive slide creation for any lesson not specifically handled
const createGenericComprehensiveSlides = (lesson, difficultyContent, slides) => {
  const content = difficultyContent.mainContent || difficultyContent;
  
  // Core concept introduction
  slides.push({
    id: `${lesson.id}-concept-intro`,
    type: 'concept',
    content: {
      title: "Core Concept",
      explanation: content.introduction || difficultyContent.introduction || lesson.coreConcept,
      icon: getIconForLesson(lesson.id),
      keyPoints: difficultyContent.keyPoints || extractKeyPoints(content)
    }
  });

  // Handle any categories
  if (content.categories) {
    content.categories.forEach((category, index) => {
      slides.push({
        id: `${lesson.id}-category-${index}`,
        type: 'concept',
        content: {
          title: category.type || category.name || `Category ${index + 1}`,
          explanation: category.description,
          icon: category.icon || "🔹",
          keyPoints: [
            ...(category.tools ? [`Tools: ${category.tools.join(', ')}`] : []),
            ...(category.examples ? category.examples : []),
            ...(category.applications ? category.applications : [])
          ]
        }
      });
    });
  }

  // Handle examples
  if (difficultyContent.examples) {
    difficultyContent.examples.forEach((example, index) => {
      slides.push({
        id: `${lesson.id}-example-${index}`,
        type: 'example',
        content: {
          title: `Example ${index + 1}`,
          example: typeof example === 'string' ? example : example.description || example.task,
          explanation: typeof example === 'object' ? example.explanation || example.why : "This demonstrates the concept in practice.",
          icon: "💡"
        }
      });
    });
  }

  // Review slide
  slides.push({
    id: `${lesson.id}-review`,
    type: 'concept',
    content: {
      title: "Lesson Review",
      explanation: "Great work! Let's review what you've learned:",
      icon: "📝",
      keyPoints: [
        ...(difficultyContent.keyPoints || []),
        ...(content.categories ? [`Learned ${content.categories.length} main categories`] : []),
        ...(difficultyContent.examples ? [`Explored ${difficultyContent.examples.length} examples`] : []),
        "Ready for the assessment!"
      ]
    }
  });
};

// Helper function to get appropriate icon for lesson
const getIconForLesson = (lessonId) => {
  const iconMap = {
    'welcome-ai-revolution': '🚀',
    'how-ai-thinks': '🧠',
    'ai-vocabulary-bootcamp': '📚',
    'prompting-essentials': '✍️',
    'prompt-engineering-action': '⚡',
    'creative-ai-mastery': '🎨',
    'ai-workflow-fundamentals': '🔄',
    'ai-daily-applications': '🏠',
    'local-ai-mastery': '💻',
    'ai-problem-solving-capstone': '🎯',
    'vibe-code-video-game': '🎮'
  };
  return iconMap[lessonId] || '🤖';
};

// Helper function to get appropriate icon for vocabulary categories
const getIconForCategory = (category) => {
  const categoryIconMap = {
    'Core Concepts': '🎯',
    'How to Use AI': '✍️',
    'How AI Works': '⚙️',
    'AI Problems': '⚠️',
    'AI Settings': '🔧',
    'How AI Learns': '📖',
    'Computer Science': '💻',
    'AI Applications': '🔮',
    'Technical Terms': '🔧',
    'AI Capabilities': '🚀',
    'AI Development': '🛠️',
    'Technical Process': '⚡',
    'AI Ethics': '⚖️',
    'AI Types': '🔍',
    'AI Architecture': '🏗️',
    'AI Mechanisms': '⚙️',
    'AI Training': '🎓',
    'AI Enhancement': '📈',
    'AI Optimization': '⚡',
    'AI Phenomena': '✨',
    'AI Safety': '🛡️'
  };
  return categoryIconMap[category] || '📚';
};

// Helper functions for lesson expectations
const getExpectationPoint1 = (lessonId, content) => {
  const expectations = {
    'prompting-essentials': 'Master the key elements of effective prompts',
    'prompt-engineering-action': 'Learn advanced prompting techniques like few-shot and chain-of-thought',
    'creative-ai-mastery': 'Discover how to create images, videos, and voices with AI',
    'ai-workflow-fundamentals': 'Build multi-step AI workflows for complex tasks',
    'ai-daily-applications': 'Apply AI to school, work, and personal life',
    'local-ai-mastery': 'Run AI privately on your own computer',
    'ai-problem-solving-capstone': 'Create a complete project using all your AI skills',
    'welcome-ai-revolution': 'Understand what AI is and its different types',
    'how-ai-thinks': 'Learn how AI processes information and generates responses',
    'ai-vocabulary-bootcamp': 'Master 25+ essential AI terms and concepts'
  };
  return expectations[lessonId] || 'Learn core concepts and principles';
};

const getExpectationPoint2 = (lessonId, content) => {
  const expectations = {
    'prompting-essentials': 'Practice with weak vs strong prompt examples',
    'prompt-engineering-action': 'Apply techniques through hands-on practice exercises',
    'creative-ai-mastery': 'Practice prompting for different creative tools',
    'ai-workflow-fundamentals': 'Design and build your own AI workflows',
    'ai-daily-applications': 'Get practical prompts for everyday tasks',
    'local-ai-mastery': 'Choose the right tools and setup for your needs',
    'ai-problem-solving-capstone': 'Plan and execute a real-world AI solution',
    'welcome-ai-revolution': 'Explore AI tools and their real-world applications',
    'how-ai-thinks': 'Understand training, tokens, and prediction processes',
    'ai-vocabulary-bootcamp': 'Practice with interactive exercises and quizzes'
  };
  return expectations[lessonId] || 'Practice through interactive exercises';
};

const getExpectationPoint3 = (lessonId, content) => {
  const expectations = {
    'prompting-essentials': 'Build confidence in writing clear, effective prompts',
    'prompt-engineering-action': 'Create professional-quality AI interactions',
    'creative-ai-mastery': 'Start creating amazing visual and audio content',
    'ai-workflow-fundamentals': 'Combine multiple AI tools for powerful results',
    'ai-daily-applications': 'Make AI a helpful part of your daily routine',
    'local-ai-mastery': 'Set up and use AI tools privately and securely',
    'ai-problem-solving-capstone': 'Showcase your complete AI mastery',
    'welcome-ai-revolution': 'Start using AI tools confidently in your projects',
    'how-ai-thinks': 'Write better prompts by understanding AI limitations',
    'ai-vocabulary-bootcamp': 'Speak confidently about AI with proper terminology'
  };
  return expectations[lessonId] || 'Apply knowledge to real-world scenarios';
};

// Helper functions for unique content generation
const getSimplifiedExplanation = (term, definition) => {
  const simplifications = {
    'Image AI': 'You type words describing a picture, and AI draws it for you',
    'Image Generation': 'You type words describing a picture, and AI draws it for you',
    'Video AI': 'You describe a scene and AI creates a short video of it',
    'Video Generation': 'You describe a scene and AI creates a short video of it',
    'Voice AI': 'AI that can speak text out loud in different voices and styles',
    'Voice & Audio AI': 'AI that can speak text out loud in different voices and styles',
    'Text AI': 'AI that reads your questions and writes helpful answers back',
    'Large Language Models (LLMs)': 'Super smart AI that understands and writes text like a human'
  };
  
  const generic = definition.split(' ').slice(0, 8).join(' ') + '...';
  return simplifications[term] || `In simple terms: ${generic}`;
};

const getToolExample = (toolType) => {
  const examples = {
    'Image AI': 'Create a logo for your family business or artwork for your bedroom wall',
    'Image Generation': 'Design birthday invitations or make custom phone wallpapers',
    'Video AI': 'Make a short video explaining your school project or hobby',
    'Video Generation': 'Create animated stories or document family memories creatively',
    'Voice AI': 'Record audiobooks of your stories or create podcast intros',
    'Voice & Audio AI': 'Make custom alarm sounds or practice language pronunciation',
    'Text AI': 'Get help writing essays, emails, or creative stories',
    'Large Language Models (LLMs)': 'Ask questions about homework or get help planning projects'
  };
  
  return examples[toolType] || 'Use this tool for creative projects and problem-solving';
};

// Helper functions for technique practice
const getTechniquePracticeSentence = (techniqueName) => {
  const sentences = {
    'Show Examples': 'To teach AI a pattern, you should ______ a few examples first.',
    'Few-Shot Prompting': 'To establish a format, provide ______ examples for the AI to follow.',
    'Ask for Steps': 'For complex problems, tell AI to think ______.',
    'Chain-of-Thought Reasoning': 'To get better reasoning, ask AI to work through problems ______.',
    'Try Again Better': 'If the first response isn\'t quite right, you should ______ it.',
    'Iterative Refinement': 'To improve AI responses, give ______ feedback and ask for improvements.'
  };
  return sentences[techniqueName] || `${techniqueName} helps you ______ better AI responses.`;
};

const getTechniqueAnswer = (techniqueName) => {
  const answers = {
    'Show Examples': 'show',
    'Few-Shot Prompting': 'two or three',
    'Ask for Steps': 'step by step',
    'Chain-of-Thought Reasoning': 'step by step',
    'Try Again Better': 'improve',
    'Iterative Refinement': 'specific'
  };
  return answers[techniqueName] || 'get';
};

const getTechniqueOptions = (techniqueName) => {
  const options = {
    'Show Examples': ['show', 'hide', 'skip', 'ignore'],
    'Few-Shot Prompting': ['two or three', 'many', 'one', 'no'],
    'Ask for Steps': ['step by step', 'very fast', 'creatively', 'randomly'],
    'Chain-of-Thought Reasoning': ['step by step', 'quickly', 'silently', 'backwards'],
    'Try Again Better': ['improve', 'accept', 'delete', 'ignore'],
    'Iterative Refinement': ['specific', 'vague', 'no', 'random']
  };
  return options[techniqueName] || ['get', 'avoid', 'ignore', 'skip'];
};

// Helper function to extract key points from content
const extractKeyPoints = (content) => {
  if (content.keyPoints) return content.keyPoints;
  
  const points = [];
  if (content.aiDefinition) points.push(`Definition: ${content.aiDefinition}`);
  if (content.aiVsChatbots) points.push(`Key distinction: ${content.aiVsChatbots}`);
  if (content.categories) points.push(`Categories covered: ${content.categories.length} types`);
  
  return points.length > 0 ? points : ['Important concepts covered in this lesson'];
};

// Get lesson adapted for specific difficulty level
export const getAdaptedLessonContent = (lessonId, difficulty = 'intermediate') => {
  // Check for our test lesson first
  if (lessonId === 'conditional-test') {
    return conditionalTestLesson;
  }
  
  const lesson = getAdaptiveLessonById(lessonId);
  if (!lesson) return null;
  
  const slides = convertAdaptiveLessonToSlides(lesson, difficulty);
  
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.coreConcept,
    estimatedTime: lesson.estimatedTime?.[difficulty] || 20,
    xpReward: lesson.xpRewards?.[difficulty] || 100,
    slides: slides,
    difficulty: difficulty,
    lessonType: lesson.lessonType
  };
};