/**
 * Easy-level KeyTrain workshops — plain language for beginners of all ages.
 */
import { workshop } from "./keytrain-workshop-factory.js";

/**
 * @param {object} c
 * @param {string} c.id
 * @param {string} c.code
 * @param {string} c.title
 * @param {string} c.what
 * @param {string} c.like
 * @param {string[]} c.ideas
 * @param {object} c.q1
 * @param {object} c.q2
 * @param {string[]} c.habits
 * @param {string[]} c.takeaways
 */
function easy(c) {
  return workshop({
    id: c.id,
    categoryId: c.id,
    level: "easy",
    title: c.title,
    code: c.code,
    tagline: "Easy start — simple words, no jargon required.",
    topics: c.ideas,
    steps: [
      {
        id: "welcome",
        type: "lesson",
        title: "What is this about?",
        paragraphs: [c.what, c.like],
        bullets: c.ideas.map((t) => `Remember: ${t}`),
      },
      {
        id: "ideas",
        type: "lesson",
        title: "Three simple ideas",
        paragraphs: ["You do not need to be a computer expert. These habits help everyone."],
        bullets: c.ideas,
      },
      {
        id: "check-1",
        type: "quiz",
        title: "Quick check",
        prompt: c.q1.prompt,
        options: c.q1.options,
        correct: c.q1.correct,
        explanation: c.q1.explanation,
      },
      {
        id: "habits",
        type: "checklist",
        title: "Good habits to try",
        paragraphs: ["Tap each line when it makes sense to you."],
        items: c.habits.map((h, i) => ({
          id: `h${i}`,
          label: h.label,
          detail: h.detail,
        })),
      },
      {
        id: "check-2",
        type: "quiz",
        title: "What would you do?",
        prompt: c.q2.prompt,
        options: c.q2.options,
        correct: c.q2.correct,
        explanation: c.q2.explanation,
      },
      {
        id: "done",
        type: "summary",
        title: "You finished the easy lesson",
        paragraphs: ["Nice work. You can try Medium when you want more detail, or Hard for tough practice."],
        bullets: c.takeaways,
      },
    ],
  });
}

/** @type {Record<string, import('../workshop-runner.js').KeytrainWorkshop>} */
export const EASY_WORKSHOPS = {
  "keytrain-identity-access": easy({
    id: "keytrain-identity-access",
    code: "KT-IAS",
    title: "Identity & Access Security",
    what: "This topic is about who is allowed to use a computer account, app, or building system—and who is not.",
    like: "Think of it like the front door of your home. A password is one kind of key. Some people also use a second check, like a code on their phone, before the door opens.",
    ideas: [
      "A password should be secret, like a house key.",
      "Do not share passwords with friends or strangers.",
      "If your phone asks “Was this you?” and you did not try to sign in, say no and tell a grown-up or IT helper.",
    ],
    q1: {
      prompt: "A stranger online says, “Tell me your password and I will give you a prize.” What should you do?",
      options: [
        { id: "a", text: "Give them the password" },
        { id: "b", text: "Say no and do not share your password" },
        { id: "c", text: "Share only part of the password" },
        { id: "d", text: "Write the password in a public post" },
      ],
      correct: ["b"],
      explanation: "Passwords are private. Real helpers never ask for your full password in a random message.",
    },
    q2: {
      prompt: "You get a pop-up on your phone: “Approve sign-in?” but you are not signing in anywhere. Best first step?",
      options: [
        { id: "a", text: "Tap Approve to clear it" },
        { id: "b", text: "Tap Deny and tell someone who helps with technology" },
        { id: "c", text: "Turn off your phone forever" },
        { id: "d", text: "Share the code with a coworker" },
      ],
      correct: ["b"],
      explanation: "That pop-up can mean someone else is trying to use your account. Deny it and get help.",
    },
    habits: [
      { label: "Use a long password you can remember", detail: "Or use a password helper app if your family or workplace allows it." },
      { label: "Lock your screen when you walk away", detail: "Like locking the front door when you leave home." },
      { label: "Use different passwords for important sites", detail: "So one stolen password does not open everything." },
    ],
    takeaways: [
      "Only you should know your passwords.",
      "A surprise sign-in check on your phone is a warning—deny and ask for help.",
      "Easy lessons are the first step; Medium adds more workplace detail.",
    ],
  }),

  "keytrain-email-security": easy({
    id: "keytrain-email-security",
    code: "KT-EMS",
    title: "Email Security",
    what: "Email is electronic mail. Bad people sometimes send fake emails to trick you into clicking links or sending money.",
    like: "Treat surprise emails like a stranger at your door claiming to be the bank. Pause and check before you open the door.",
    ideas: [
      "Do not click strange links in email or text messages.",
      "If an email feels urgent or scary, slow down.",
      "The real company name in the address matters—look closely for typos.",
    ],
    q1: {
      prompt: "An email says “You won a gift card! Click here now!” from an address you do not know. What is safest?",
      options: [
        { id: "a", text: "Click the link right away" },
        { id: "b", text: "Delete the email or report it as junk without clicking" },
        { id: "c", text: "Reply with your home address" },
        { id: "d", text: "Forward it to all your contacts" },
      ],
      correct: ["b"],
      explanation: "Surprise prizes in email are often tricks. Do not click unknown links.",
    },
    q2: {
      prompt: "An email looks like it is from your boss and asks you to buy gift cards today. What should you do?",
      options: [
        { id: "a", text: "Buy the cards immediately" },
        { id: "b", text: "Call or talk to your boss using a number you already trust—not the email link" },
        { id: "c", text: "Email back the gift card codes" },
        { id: "d", text: "Post the request online" },
      ],
      correct: ["b"],
      explanation: "Criminals pretend to be people you know. Check in person or by phone before sending money.",
    },
    habits: [
      { label: "Look at who sent the message", detail: "Not just the display name at the top." },
      { label: "Do not open surprise attachments", detail: "Especially if you were not expecting a file." },
      { label: "Ask for help when unsure", detail: "A family member, teacher, or tech helper can review with you." },
    ],
    takeaways: [
      "Slow down on urgent or too-good-to-be-true emails.",
      "Check with someone you trust before paying or clicking.",
    ],
  }),

  "keytrain-data-protection": easy({
    id: "keytrain-data-protection",
    code: "KT-DP",
    title: "Data Protection",
    what: "Data means information stored on a computer—photos, names, health info, or school records. Protection means keeping it safe from the wrong eyes.",
    like: "Private information is like a diary. You choose who may read it.",
    ideas: [
      "Do not post private details on public websites.",
      "Lock your phone and computer with a passcode.",
      "Think before you share photos that show addresses or ID cards.",
    ],
    q1: {
      prompt: "A friend asks for a photo of your driver’s license “for fun.” What is the safer choice?",
      options: [
        { id: "a", text: "Send the photo in a group chat" },
        { id: "b", text: "Say no—ID photos can be used to steal your identity" },
        { id: "c", text: "Post it on social media" },
        { id: "d", text: "Email it to strangers" },
      ],
      correct: ["b"],
      explanation: "IDs have numbers criminals can misuse. Keep them private.",
    },
    q2: {
      prompt: "You find a USB stick in the parking lot. What should you do?",
      options: [
        { id: "a", text: "Plug it into your work computer to see what is on it" },
        { id: "b", text: "Give it to security or IT—do not plug it in yourself" },
        { id: "c", text: "Take it home and share files with friends" },
        { id: "d", text: "Throw it in the trash without telling anyone" },
      ],
      correct: ["b"],
      explanation: "Unknown USB devices can carry viruses. Let trained staff handle them.",
    },
    habits: [
      { label: "Use screen lock on phones and tablets", detail: "A simple PIN or fingerprint helps." },
      { label: "Share less personal info online", detail: "Birthdays, school name, and location can be misused." },
      { label: "Back up important photos", detail: "So you do not lose them if a device breaks." },
    ],
    takeaways: [
      "Treat personal information like something valuable.",
      "When unsure about sharing, choose the safer, smaller share.",
    ],
  }),

  "keytrain-endpoint-security": easy({
    id: "keytrain-endpoint-security",
    code: "KT-EPS",
    title: "Endpoint Security",
    what: "An endpoint is a device you use—phone, tablet, or computer. Security means keeping bad software off that device.",
    like: "Your device is like your backpack. You do not want someone to hide something harmful inside it.",
    ideas: [
      "Install updates when the device asks—updates fix holes.",
      "Do not download apps from random websites.",
      "If the screen says a virus was found, tell someone who can help.",
    ],
    q1: {
      prompt: "A website says “Download this player to watch the video” and it is not an official app store. What should you do?",
      options: [
        { id: "a", text: "Download it quickly" },
        { id: "b", text: "Close the page and use a trusted app store or official site instead" },
        { id: "c", text: "Turn off all security" },
        { id: "d", text: "Share the link with everyone" },
      ],
      correct: ["b"],
      explanation: "Random downloads often hide harmful software. Use official stores when possible.",
    },
    q2: {
      prompt: "Your files suddenly have a new ending and a note demands money to open them. What is the first step?",
      options: [
        { id: "a", text: "Pay the money right away" },
        { id: "b", text: "Disconnect from Wi‑Fi and tell IT or a trusted helper immediately" },
        { id: "c", text: "Ignore it and keep working" },
        { id: "d", text: "Email the criminals your bank info" },
      ],
      correct: ["b"],
      explanation: "That can be ransomware. Get help fast—do not pay without guidance.",
    },
    habits: [
      { label: "Restart after big updates", detail: "Helps fixes finish installing." },
      { label: "Leave security software turned on", detail: "Do not disable it without approval." },
      { label: "Tell someone if the computer acts strange", detail: "Pop-ups, slowness, or new toolbars you did not add." },
    ],
    takeaways: [
      "Updates and trusted downloads are simple daily protection.",
      "Strange file changes need fast help from an adult or IT.",
    ],
  }),

  "keytrain-network-security": easy({
    id: "keytrain-network-security",
    code: "KT-NET",
    title: "Network Security",
    what: "A network connects devices—like Wi‑Fi at home or work. Security means only the right traffic should move between them.",
    like: "Wi‑Fi is like a hallway in a building. You want a lock on the door, not an open hallway for anyone.",
    ideas: [
      "Use a password on home Wi‑Fi.",
      "Be careful on free public Wi‑Fi—it may not be private.",
      "Do not plug unknown cables or boxes into your network at work.",
    ],
    q1: {
      prompt: "Free café Wi‑Fi has no password. You want to check your bank balance. What is safer?",
      options: [
        { id: "a", text: "Log in to the bank on café Wi‑Fi" },
        { id: "b", text: "Use your phone’s mobile data or wait until you are on trusted Wi‑Fi at home" },
        { id: "c", text: "Share the Wi‑Fi password with strangers" },
        { id: "d", text: "Turn off your bank password" },
      ],
      correct: ["b"],
      explanation: "Open Wi‑Fi can let others see traffic. Use a safer connection for banking.",
    },
    q2: {
      prompt: "A box arrives labeled “free Wi‑Fi booster—plug in here.” What should you do?",
      options: [
        { id: "a", text: "Plug it into the office network right away" },
        { id: "b", text: "Ask IT before plugging anything into the network" },
        { id: "c", text: "Give it to a random visitor" },
        { id: "d", text: "Hide it under your desk" },
      ],
      correct: ["b"],
      explanation: "Unknown hardware can open hidden doors into a network. IT must approve devices.",
    },
    habits: [
      { label: "Keep home router password set", detail: "Change default passwords on new equipment." },
      { label: "Forget public Wi‑Fi after use", detail: "So your device does not auto-join risky networks." },
      { label: "Report odd slowness or disconnects at work", detail: "Can be a sign of network trouble." },
    ],
    takeaways: [
      "Not all Wi‑Fi is private—choose carefully for sensitive tasks.",
      "Only approved devices should join work networks.",
    ],
  }),

  "keytrain-system-hygiene": easy({
    id: "keytrain-system-hygiene",
    code: "KT-SYS",
    title: "System Hygiene",
    what: "Hygiene means keeping things clean and healthy. For computers, that means updates, supported software, and tidy settings.",
    like: "Like brushing teeth and washing hands—small habits prevent bigger problems later.",
    ideas: [
      "Run updates when the computer asks.",
      "Remove apps you no longer use.",
      "Do not keep very old systems on the internet if they cannot update.",
    ],
    q1: {
      prompt: "Your computer says “Update ready—restart tonight?” You are not busy tomorrow. Good choice?",
      options: [
        { id: "a", text: "Ignore updates forever" },
        { id: "b", text: "Allow the update and restart when you can" },
        { id: "c", text: "Delete the update file" },
        { id: "d", text: "Share your login with a stranger" },
      ],
      correct: ["b"],
      explanation: "Updates close security gaps. Restarting lets them finish.",
    },
    q2: {
      prompt: "A family computer still runs very old software that cannot update. It is on the internet. Risk?",
      options: [
        { id: "a", text: "No risk—old is fine" },
        { id: "b", text: "Higher risk—ask if it can be replaced or taken offline for sensitive use" },
        { id: "c", text: "Faster is always safer" },
        { id: "d", text: "Paint color fixes security" },
      ],
      correct: ["b"],
      explanation: "Old systems miss security fixes. Replace or limit what they can reach.",
    },
    habits: [
      { label: "Restart after updates", detail: "Helps the computer finish patching." },
      { label: "Uninstall programs you do not need", detail: "Less software means fewer holes." },
      { label: "Ask before changing important settings", detail: "So you do not break work tools by accident." },
    ],
    takeaways: [
      "Updates are a simple way to stay safer.",
      "Very old devices need a plan—not endless internet exposure.",
    ],
  }),

  "keytrain-application-security": easy({
    id: "keytrain-application-security",
    code: "KT-APP",
    title: "Application Security",
    what: "Applications are programs and websites—email, games, banking apps. Security means they should not leak your data or let strangers in.",
    like: "An app is like a shop window. It should only show your order to you—not to everyone walking by.",
    ideas: [
      "Log out on shared computers.",
      "Do not reuse the same password on every app.",
      "If an app asks for odd permissions, question it.",
    ],
    q1: {
      prompt: "A flashlight app wants access to all your contacts and photos. What should you think?",
      options: [
        { id: "a", text: "That is normal—allow everything" },
        { id: "b", text: "That is suspicious—deny or delete the app" },
        { id: "c", text: "Share contacts on social media" },
        { id: "d", text: "Mail your password to the app maker" },
      ],
      correct: ["b"],
      explanation: "Simple apps rarely need all your data. Too many permissions can mean spying.",
    },
    q2: {
      prompt: "You use a library computer for email. When you leave, you should:",
      options: [
        { id: "a", text: "Leave the browser open for the next person" },
        { id: "b", text: "Log out and close the browser" },
        { id: "c", text: "Save your password in the browser for everyone" },
        { id: "d", text: "Write your password on a sticky note on the monitor" },
      ],
      correct: ["b"],
      explanation: "Shared computers need a full sign-out so the next user cannot see your account.",
    },
    habits: [
      { label: "Log out on shared devices", detail: "Libraries, schools, and kiosks." },
      { label: "Read permission pop-ups", detail: "Only allow what makes sense." },
      { label: "Get apps from official stores", detail: "When possible on phones and tablets." },
    ],
    takeaways: [
      "Apps should not ask for more access than they need.",
      "Shared computers always get a proper logout.",
    ],
  }),

  "keytrain-financial-security": easy({
    id: "keytrain-financial-security",
    code: "KT-FIN",
    title: "Financial Security",
    what: "This is about protecting money—bank accounts, gift cards, invoices, and payments—from tricks and theft.",
    like: "Treat payment requests like handing someone cash. Double-check before you pay.",
    ideas: [
      "Slow down on urgent money requests.",
      "Talk to a real person you trust before changing bank details.",
      "Never email gift card codes to strangers.",
    ],
    q1: {
      prompt: "A text says your nephew needs gift cards now and to text the codes back. You did not speak to your nephew. What now?",
      options: [
        { id: "a", text: "Buy cards and text the codes" },
        { id: "b", text: "Call your nephew on a number you already know—not the text link" },
        { id: "c", text: "Post the text online" },
        { id: "d", text: "Send your bank password" },
      ],
      correct: ["b"],
      explanation: "Scammers pretend to be family. Call using a trusted number before sending money.",
    },
    q2: {
      prompt: "An invoice looks real but the bank account changed at the last minute. Best step?",
      options: [
        { id: "a", text: "Pay immediately to be polite" },
        { id: "b", text: "Call the company using a known phone number to confirm the account" },
        { id: "c", text: "Pay half now" },
        { id: "d", text: "Share the invoice on social media" },
      ],
      correct: ["b"],
      explanation: "Changing payment details is a common trick. Verify out of band.",
    },
    habits: [
      { label: "Pause on urgent payment asks", detail: "Scammers use hurry to stop you thinking." },
      { label: "Use two people for big transfers at work", detail: "When your job allows it." },
      { label: "Keep gift card codes private", detail: "Like cash—whoever has the code can spend it." },
    ],
    takeaways: [
      "Verify money requests with a call you initiate.",
      "Changed bank numbers need a real confirmation.",
    ],
  }),

  "keytrain-physical-security": easy({
    id: "keytrain-physical-security",
    code: "KT-PHY",
    title: "Physical Security",
    what: "Physical security is about real-world protection—doors, badges, laptops left on tables, and visitors.",
    like: "It is the same as locking your car and not leaving valuables in plain sight.",
    ideas: [
      "Do not hold the door open for strangers at work without checking.",
      "Take laptops and phones with you—or lock them up.",
      "Report lost badges right away.",
    ],
    q1: {
      prompt: "Someone without a badge asks you to hold the secure door “because their hands are full.” You do not know them. What should you do?",
      options: [
        { id: "a", text: "Hold the door open" },
        { id: "b", text: "Ask them to check in at the front desk or use their own badge" },
        { id: "c", text: "Give them your badge" },
        { id: "d", text: "Look away" },
      ],
      correct: ["b"],
      explanation: "Tailgating is when someone slips in behind you. Use the official visitor process.",
    },
    q2: {
      prompt: "You step away from your desk for coffee. Your laptop has work on the screen. What is best?",
      options: [
        { id: "a", text: "Leave it open—back in a minute" },
        { id: "b", text: "Lock the screen (Windows key + L or close the lid)" },
        { id: "c", text: "Leave passwords on a sticky note" },
        { id: "d", text: "Invite strangers to look" },
      ],
      correct: ["b"],
      explanation: "Locking the screen is like locking a door—it only takes a second.",
    },
    habits: [
      { label: "Wear your badge in secure areas", detail: "Helps others know you belong." },
      { label: "Challenge unfamiliar people politely", detail: "“Can I help you find the desk?”" },
      { label: "Report lost keys or badges fast", detail: "So they can be turned off." },
    ],
    takeaways: [
      "Doors and badges protect people and data inside.",
      "Screen lock is a small habit with big payoff.",
    ],
  }),

  "keytrain-compliance-governance": easy({
    id: "keytrain-compliance-governance",
    code: "KT-CG",
    title: "Compliance & Governance",
    what: "Compliance means following rules that protect people’s information—at school, hospital, or work. Governance means clear plans so everyone knows the rules.",
    like: "Like classroom rules or sports rules—they keep everyone fair and safe.",
    ideas: [
      "Read the privacy rules for places that store health or school records.",
      "Only look up information your job or role allows.",
      "Tell a supervisor if you think data was shared wrongly.",
    ],
    q1: {
      prompt: "A friend who works in billing asks you to look up a celebrity’s health record “just curious.” What should you do?",
      options: [
        { id: "a", text: "Look it up quickly" },
        { id: "b", text: "Say no—only look up records you need for your own approved work" },
        { id: "c", text: "Post findings online" },
        { id: "d", text: "Share your login so they can look" },
      ],
      correct: ["b"],
      explanation: "Health and school records have strict rules. Curiosity is not a valid reason to view them.",
    },
    q2: {
      prompt: "Your workplace says “complete security training by Friday.” Why does that matter?",
      options: [
        { id: "a", text: "It does not matter—skip it" },
        { id: "b", text: "It helps everyone learn the same safety rules" },
        { id: "c", text: "Only managers need rules" },
        { id: "d", text: "Rules are only for computers" },
      ],
      correct: ["b"],
      explanation: "Training turns rules into habits so mistakes happen less often.",
    },
    habits: [
      { label: "Finish assigned safety training", detail: "Short lessons protect real people." },
      { label: "Ask if unsure before sharing data", detail: "Better to ask than to guess." },
      { label: "Report mistakes quickly", detail: "Early reports fix harm faster." },
    ],
    takeaways: [
      "Rules protect privacy—especially health and school information.",
      "When in doubt, ask before you share.",
    ],
  }),
};
