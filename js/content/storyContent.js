// storyContent.js
// Content pool for "Remember My Story" game — NER-themed episodic memory/comprehension task.
// Structure: storyContent[level] = array of story objects.
// Each story: { id, text, questions: [{ question, options: [...], correctIndex }] }
// Completion rule (enforced in game logic, not here): ALL questions for a story must be answered correctly.

const storyContent = {
  1: [
    {
      id: "l1_s1",
      text: "Ravi went to the market in the morning. He bought bananas and milk. Then he came home and gave the bananas to his daughter.",
      questions: [
        { question: "Where did Ravi go?", options: ["Hospital", "Market", "Park"], correctIndex: 1 },
        { question: "What did he buy?", options: ["Bananas and milk", "Rice and eggs", "Bread and tea"], correctIndex: 0 },
        { question: "Who did he give the bananas to?", options: ["His daughter", "His son", "His neighbor"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s2",
      text: "Tenzin went to the market in Kohima in the morning. He bought fresh pineapples and a packet of tea leaves. On his way home, he stopped to greet his neighbor. In the evening, he shared the pineapples with his family.",
      questions: [
        { question: "Where did Tenzin go?", options: ["Hospital", "Market", "School"], correctIndex: 1 },
        { question: "What did he buy?", options: ["Pineapples and tea leaves", "Rice and fish", "Bread and milk"], correctIndex: 0 },
        { question: "Who did he share the pineapples with?", options: ["His family", "His neighbor", "His friend"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s3",
      text: "Ima cooked khar for lunch today. She added bamboo shoot and raw papaya to the pot. Her grandson came home from school and smelled the food from the door. He was very happy to see his favorite dish.",
      questions: [
        { question: "What did Ima cook?", options: ["Khar", "Thukpa", "Momos"], correctIndex: 0 },
        { question: "Who came home from school?", options: ["Her grandson", "Her son", "Her neighbor"], correctIndex: 0 },
        { question: "How did he feel?", options: ["Happy", "Angry", "Tired"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s4",
      text: "Binod and his wife went to Dimapur to visit the weekly market. They bought a basket of oranges and some fresh fish. On the way back, it started to rain, so they waited under a tea stall.",
      questions: [
        { question: "Which city's market did they visit?", options: ["Dimapur", "Guwahati", "Shillong"], correctIndex: 0 },
        { question: "What two things did they buy?", options: ["Oranges and fish", "Rice and vegetables", "Milk and eggs"], correctIndex: 0 },
        { question: "Why did they stop at the tea stall?", options: ["It started to rain", "They were hungry", "They met a friend"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s5",
      text: "Lily made pitha for the morning tea. Her husband Robin brought fresh milk from the neighbor's house. They sat together on the veranda and enjoyed their breakfast while watching the hills.",
      questions: [
        { question: "What did Lily make?", options: ["Pitha", "Jadoh", "Fish tenga"], correctIndex: 0 },
        { question: "Who brought the milk?", options: ["Robin", "Lily", "Their son"], correctIndex: 0 },
        { question: "Where did they sit?", options: ["Veranda", "Kitchen", "Garden"], correctIndex: 0 },
        { question: "What did they watch while eating?", options: ["The hills", "The rain", "The road"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s6",
      text: "Anup went fishing near the river early in the morning. He caught two fish and picked some wild herbs on his way back. His mother cooked fish tenga for dinner using what he brought home.",
      questions: [
        { question: "Where did Anup go?", options: ["River", "Market", "Field"], correctIndex: 0 },
        { question: "What did he catch?", options: ["Fish", "Birds", "Crabs"], correctIndex: 0 },
        { question: "What did his mother cook?", options: ["Fish tenga", "Khar", "Momos"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s7",
      text: "Deepa's father brought a basket of star fruit from the garden. She washed them and kept them on a plate. Her little brother ate two pieces before dinner.",
      questions: [
        { question: "What did the father bring?", options: ["Star fruit", "Oranges", "Litchi"], correctIndex: 0 },
        { question: "What did Deepa do with them?", options: ["Washed and kept them on a plate", "Cooked them", "Gave them away"], correctIndex: 0 },
        { question: "Who ate some before dinner?", options: ["Her little brother", "Her father", "Her mother"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s8",
      text: "Momi went to Shillong to buy a new umbrella. On the way, she met her old friend Ibha at a tea shop. They talked for a while and shared a cup of tea.",
      questions: [
        { question: "Where did Momi go?", options: ["Shillong", "Imphal", "Aizawl"], correctIndex: 0 },
        { question: "What did she want to buy?", options: ["An umbrella", "A basket", "A blanket"], correctIndex: 0 },
        { question: "Who did she meet?", options: ["Ibha", "Her sister", "Her neighbor"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s9",
      text: "Ratan caught a kiwi fruit falling from the tree in his yard. He gave it to his grandmother, who was sitting on the porch. She smiled and thanked him warmly.",
      questions: [
        { question: "What fell from the tree?", options: ["Kiwi fruit", "Pineapple", "Star fruit"], correctIndex: 0 },
        { question: "Who did Ratan give it to?", options: ["His grandmother", "His mother", "His friend"], correctIndex: 0 },
        { question: "Where was she sitting?", options: ["Porch", "Kitchen", "Garden"], correctIndex: 0 }
      ]
    },
    {
      id: "l1_s10",
      text: "Suman's wife made hot thukpa for dinner because it was raining outside. He came home wet and tired, and the warm soup made him feel much better.",
      questions: [
        { question: "What did his wife make?", options: ["Thukpa", "Khar", "Pitha"], correctIndex: 0 },
        { question: "Why did she make it?", options: ["It was raining", "It was his birthday", "They had guests"], correctIndex: 0 },
        { question: "How did Suman feel after eating?", options: ["Much better", "Still cold", "Angry"], correctIndex: 0 }
      ]
    }
  ],

  2: [
    {
      id: "l2_s1",
      text: "Ranjit woke up early and went to the tea garden near his house. He picked fresh tea leaves with his neighbor Bidya. After an hour, they carried the leaves home in a basket. Ranjit's wife made a cup of tea using some of the fresh leaves. Everyone enjoyed the tea on the veranda.",
      questions: [
        { question: "Where did Ranjit go?", options: ["Tea garden", "Market", "River"], correctIndex: 0 },
        { question: "Who helped him pick leaves?", options: ["Bidya", "His wife", "His son"], correctIndex: 0 },
        { question: "What did they carry the leaves in?", options: ["A basket", "A bag", "A box"], correctIndex: 0 },
        { question: "Where did they enjoy the tea?", options: ["Veranda", "Kitchen", "Garden"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s2",
      text: "Sanju's grandmother asked him to buy pineapples from the market. He walked to the market and found fresh pineapples at a stall. He also bought some litchi because they looked sweet. When he came home, his grandmother cut the fruits and shared them with the whole family.",
      questions: [
        { question: "Who sent Sanju to the market?", options: ["His grandmother", "His mother", "His father"], correctIndex: 0 },
        { question: "What did he buy first?", options: ["Pineapples", "Oranges", "Bananas"], correctIndex: 0 },
        { question: "What else did he buy?", options: ["Litchi", "Star fruit", "Kiwi"], correctIndex: 0 },
        { question: "Who cut the fruits at home?", options: ["His grandmother", "His mother", "Sanju himself"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s3",
      text: "Ema and her husband Toshi went for a walk near the river in the evening. They saw fishermen catching fish with nets. Toshi bought two fish from one of the fishermen. Ema cooked fish tenga for dinner that night. Both of them enjoyed the warm meal together.",
      questions: [
        { question: "Where did Ema and Toshi walk?", options: ["Near the river", "In the market", "In the garden"], correctIndex: 0 },
        { question: "What were the fishermen doing?", options: ["Catching fish with nets", "Selling vegetables", "Repairing boats"], correctIndex: 0 },
        { question: "What did Toshi buy?", options: ["Two fish", "A basket of vegetables", "Some bread"], correctIndex: 0 },
        { question: "What did Ema cook?", options: ["Fish tenga", "Khar", "Thukpa"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s4",
      text: "Robin's daughter Mimi came home from school with good news. She had won first prize in a drawing competition. Robin was very proud and decided to celebrate. He brought pitha and orange juice for the family. They all sat together and enjoyed the small celebration.",
      questions: [
        { question: "Who came home with good news?", options: ["Mimi", "Robin", "Robin's wife"], correctIndex: 0 },
        { question: "What did she win?", options: ["A drawing competition", "A singing competition", "A running race"], correctIndex: 0 },
        { question: "What did Robin bring to celebrate?", options: ["Pitha and orange juice", "Momos and tea", "Bread and milk"], correctIndex: 0 },
        { question: "How did Robin feel?", options: ["Proud", "Angry", "Tired"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s5",
      text: "Karma went to Dimapur to visit his old friend Lobsang. They had not met for many years. Lobsang made hot thukpa for lunch and they talked about old memories. In the afternoon, they walked around the market together. Karma bought some bamboo shoot pickle before leaving.",
      questions: [
        { question: "Where did Karma go?", options: ["Dimapur", "Kohima", "Itanagar"], correctIndex: 0 },
        { question: "Who did he visit?", options: ["Lobsang", "His brother", "His teacher"], correctIndex: 0 },
        { question: "What did Lobsang make for lunch?", options: ["Thukpa", "Khar", "Fish tenga"], correctIndex: 0 },
        { question: "What did Karma buy before leaving?", options: ["Bamboo shoot pickle", "Star fruit", "A basket"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s6",
      text: "Nita's mother was not feeling well, so Nita decided to cook dinner. She made khar with fish and rice. Her father came home tired from work and was happy to smell the food. The whole family sat together and ate dinner. Her mother felt a little better after eating the warm meal.",
      questions: [
        { question: "Why did Nita cook dinner?", options: ["Her mother was not feeling well", "She wanted to practice", "Guests were coming"], correctIndex: 0 },
        { question: "What did she make?", options: ["Khar with fish and rice", "Momos", "Pitha"], correctIndex: 0 },
        { question: "Who came home tired?", options: ["Her father", "Her mother", "Her brother"], correctIndex: 0 },
        { question: "How did the mother feel after eating?", options: ["A little better", "Worse", "The same"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s7",
      text: "Aiba and his son Wangba went fishing near the lake early in the morning. They caught several small fish and some crabs. On the way home, they stopped to buy fresh vegetables from a roadside seller. Aiba's wife cooked a big meal using everything they brought home.",
      questions: [
        { question: "Where did Aiba and Wangba go?", options: ["Near the lake", "Near the river", "Near the forest"], correctIndex: 0 },
        { question: "What did they catch?", options: ["Fish and crabs", "Only fish", "Only crabs"], correctIndex: 0 },
        { question: "What did they buy on the way home?", options: ["Fresh vegetables", "Fruits", "Bread"], correctIndex: 0 },
        { question: "Who cooked the meal?", options: ["Aiba's wife", "Aiba", "Wangba"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s8",
      text: "Lucy's brother Peter came to visit from Guwahati for the weekend. Lucy made momos and tea for him. They spent the afternoon talking and looking at old family photos. In the evening, they walked to the market and bought some star fruit. Peter left for Guwahati the next morning.",
      questions: [
        { question: "Where did Peter come from?", options: ["Guwahati", "Shillong", "Imphal"], correctIndex: 0 },
        { question: "What did Lucy make for him?", options: ["Momos and tea", "Thukpa", "Pitha"], correctIndex: 0 },
        { question: "What did they look at in the afternoon?", options: ["Old family photos", "A movie", "A newspaper"], correctIndex: 0 },
        { question: "What did they buy in the evening?", options: ["Star fruit", "Litchi", "Oranges"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s9",
      text: "Doni took his daughter Ashi to the weekly market in Itanagar. They walked through many stalls selling fruits, vegetables, and clothes. Ashi wanted a new basket, so Doni bought one for her. On the way home, they stopped to eat momos at a small stall.",
      questions: [
        { question: "Where did Doni take Ashi?", options: ["Weekly market in Itanagar", "School", "Hospital"], correctIndex: 0 },
        { question: "What did the stalls sell?", options: ["Fruits, vegetables, and clothes", "Only fruits", "Only clothes"], correctIndex: 0 },
        { question: "What did Ashi want?", options: ["A new basket", "A new dress", "A new toy"], correctIndex: 0 },
        { question: "What did they eat on the way home?", options: ["Momos", "Thukpa", "Pitha"], correctIndex: 0 }
      ]
    },
    {
      id: "l2_s10",
      text: "Sentila's husband Kevi came home early from work with a surprise. He had brought a basket of kiwi and passion fruit from the local orchard. Sentila was delighted and quickly washed the fruits. They sat together in the kitchen and shared the fruits with their children.",
      questions: [
        { question: "Who came home early?", options: ["Kevi", "Sentila", "Their children"], correctIndex: 0 },
        { question: "What did he bring?", options: ["Kiwi and passion fruit", "Oranges and litchi", "Pineapple and star fruit"], correctIndex: 0 },
        { question: "Where did he get them from?", options: ["Local orchard", "Market", "Neighbor's garden"], correctIndex: 0 },
        { question: "Where did they sit to share the fruits?", options: ["Kitchen", "Veranda", "Garden"], correctIndex: 0 }
      ]
    }
  ],

  3: [
    {
      id: "l3_s1",
      text: "Ratan and his wife Mona decided to visit their son Bikash in Aizawl for the weekend. They packed a basket of oranges and pitha to bring along. On the way, they stopped at a small tea stall run by an old friend named Lalrin. He gave them a warm welcome and offered tea for free. When they finally reached Bikash's house, he was surprised and very happy to see his parents. They all sat together and shared the food Mona had packed.",
      questions: [
        { question: "Who did Ratan and Mona visit?", options: ["Their son Bikash", "Their daughter", "Their friend"], correctIndex: 0 },
        { question: "Where does Bikash live?", options: ["Aizawl", "Kohima", "Shillong"], correctIndex: 0 },
        { question: "What did they pack for the trip?", options: ["Oranges and pitha", "Momos and tea", "Fish and rice"], correctIndex: 0 },
        { question: "Who ran the tea stall?", options: ["Lalrin", "Bikash", "Mona"], correctIndex: 0 },
        { question: "How did Bikash feel when he saw his parents?", options: ["Surprised and happy", "Angry", "Confused"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s2",
      text: "Deben, his wife Ruma, and their daughter Priya went to the local fair in Guwahati. Deben bought a small toy for Priya, while Ruma bought a basket of litchi from a fruit seller. They also met their old neighbor Tapan, who was selling handmade baskets at the fair. Priya was delighted with her toy and played with it the whole evening. Before leaving, the family stopped to eat momos together.",
      questions: [
        { question: "Where did the family go?", options: ["Local fair in Guwahati", "Market", "School event"], correctIndex: 0 },
        { question: "What did Deben buy for Priya?", options: ["A toy", "A fruit", "A dress"], correctIndex: 0 },
        { question: "What did Ruma buy?", options: ["A basket of litchi", "Pineapples", "Star fruit"], correctIndex: 0 },
        { question: "Who did they meet at the fair?", options: ["Tapan", "Bikash", "Lalrin"], correctIndex: 0 },
        { question: "What did the family eat before leaving?", options: ["Momos", "Thukpa", "Fish tenga"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s3",
      text: "Nokchan lived with his wife Aben and his younger brother Sanen in a small village near Kohima. One morning, Aben cooked khar for breakfast using ingredients Sanen had brought from the field. While eating, their neighbor Vilie came to borrow some rice. Nokchan gave her a bag of rice and she thanked him warmly. Later that day, Sanen went fishing near the river and caught two fish for dinner.",
      questions: [
        { question: "Where did Nokchan and his family live?", options: ["Near Kohima", "Near Shillong", "Near Imphal"], correctIndex: 0 },
        { question: "Who cooked breakfast?", options: ["Aben", "Sanen", "Vilie"], correctIndex: 0 },
        { question: "What did Aben cook?", options: ["Khar", "Pitha", "Momos"], correctIndex: 0 },
        { question: "Who came to borrow rice?", options: ["Vilie", "Sanen", "Aben"], correctIndex: 0 },
        { question: "What did Sanen do later that day?", options: ["Went fishing", "Went to the market", "Went to school"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s4",
      text: "Meena and her husband Robin ran a small tea stall in Shillong. Every morning, their son Arjun helped set up the tables before school. One day, an old customer named Lily came by and ordered tea and pitha. She told them she was visiting from Itanagar to see her sister. Meena and Robin were happy to serve her and even gave her extra pitha for the road.",
      questions: [
        { question: "Where did Meena and Robin's tea stall stand?", options: ["Shillong", "Kohima", "Dimapur"], correctIndex: 0 },
        { question: "Who helped set up tables in the morning?", options: ["Arjun", "Lily", "Robin"], correctIndex: 0 },
        { question: "What did Lily order?", options: ["Tea and pitha", "Thukpa and momos", "Fish and rice"], correctIndex: 0 },
        { question: "Where was Lily visiting from?", options: ["Itanagar", "Aizawl", "Guwahati"], correctIndex: 0 },
        { question: "What did Meena and Robin give her extra of?", options: ["Pitha", "Tea", "Fish"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s5",
      text: "Toshi, his wife Diki, and their two children went to visit Diki's parents in Dimapur. Diki's mother had prepared a big lunch of thukpa and bamboo shoot curry. Diki's father took the children out to see the local market while the food was being prepared. When they returned, the whole family sat together and enjoyed the meal, sharing stories about the children's school.",
      questions: [
        { question: "Whose parents did they visit?", options: ["Diki's parents", "Toshi's parents", "Their neighbor's parents"], correctIndex: 0 },
        { question: "Where did they visit?", options: ["Dimapur", "Kohima", "Imphal"], correctIndex: 0 },
        { question: "What did Diki's mother prepare?", options: ["Thukpa and bamboo shoot curry", "Khar and rice", "Momos and tea"], correctIndex: 0 },
        { question: "Who took the children to the market?", options: ["Diki's father", "Toshi", "Diki"], correctIndex: 0 },
        { question: "What did the family talk about during the meal?", options: ["The children's school", "The weather", "Their work"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s6",
      text: "Ibemhal and her brother Sanajaoba lived in Imphal with their grandmother. One evening, their grandmother asked Ibemhal to cook dinner while she rested. Ibemhal made fish tenga using fish that Sanajaoba had bought earlier from the market. Their neighbor Ngangbi stopped by and was invited to join them for dinner. Everyone enjoyed the warm meal together and thanked Ibemhal for her cooking.",
      questions: [
        { question: "Where did Ibemhal and Sanajaoba live?", options: ["Imphal", "Shillong", "Aizawl"], correctIndex: 0 },
        { question: "Who asked Ibemhal to cook dinner?", options: ["Their grandmother", "Sanajaoba", "Ngangbi"], correctIndex: 0 },
        { question: "What did Ibemhal cook?", options: ["Fish tenga", "Khar", "Pitha"], correctIndex: 0 },
        { question: "Who bought the fish?", options: ["Sanajaoba", "Ibemhal", "Ngangbi"], correctIndex: 0 },
        { question: "Who joined them for dinner?", options: ["Ngangbi", "Their grandmother's friend", "No one"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s7",
      text: "Kevi and his wife Sentila owned a small orchard near Kohima. Every season, their daughter Neikho helped them pick kiwi and passion fruit. One day, a fruit trader named Vilato came to buy fruits in bulk for the market. Kevi and Sentila sold him a large basket of kiwi. Neikho kept some passion fruit aside to share with her friends later.",
      questions: [
        { question: "What did Kevi and Sentila own?", options: ["A small orchard", "A tea stall", "A shop"], correctIndex: 0 },
        { question: "Who helped pick fruits?", options: ["Neikho", "Vilato", "Sentila's sister"], correctIndex: 0 },
        { question: "What two fruits did they grow?", options: ["Kiwi and passion fruit", "Litchi and oranges", "Star fruit and pineapple"], correctIndex: 0 },
        { question: "Who came to buy fruits in bulk?", options: ["Vilato", "Neikho", "Kevi's brother"], correctIndex: 0 },
        { question: "What did Neikho keep aside?", options: ["Some passion fruit", "Some kiwi", "Nothing"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s8",
      text: "Lalawmpuia and his wife Zoremi lived in Aizawl with their son Malsawma. One weekend, Zoremi's sister Rinsangi came to visit with her husband. Malsawma was excited to see his cousins and played with them all afternoon. Zoremi prepared pitha and orange juice for everyone. Before leaving, Rinsangi thanked Zoremi for the warm hospitality.",
      questions: [
        { question: "Where did Lalawmpuia and Zoremi live?", options: ["Aizawl", "Kohima", "Dimapur"], correctIndex: 0 },
        { question: "Who came to visit?", options: ["Zoremi's sister Rinsangi", "Lalawmpuia's brother", "A neighbor"], correctIndex: 0 },
        { question: "Who was Malsawma excited to see?", options: ["His cousins", "His teacher", "His grandmother"], correctIndex: 0 },
        { question: "What did Zoremi prepare?", options: ["Pitha and orange juice", "Thukpa", "Momos"], correctIndex: 0 },
        { question: "What did Rinsangi thank Zoremi for?", options: ["Her hospitality", "The fruits", "The money"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s9",
      text: "Bidya and her husband Ranjit ran a small tea garden near Guwahati. Their worker Tapan came early every morning to help pick tea leaves. One day, Bidya's brother Deben visited with fresh litchi from his own farm. Ranjit invited Tapan to join them for tea and litchi. They all sat together under a tree and talked about the harvest season.",
      questions: [
        { question: "What did Bidya and Ranjit run?", options: ["A tea garden", "A fruit orchard", "A fish farm"], correctIndex: 0 },
        { question: "Who helped pick tea leaves?", options: ["Tapan", "Deben", "Bidya"], correctIndex: 0 },
        { question: "Who visited with fresh litchi?", options: ["Bidya's brother Deben", "Ranjit's friend", "A neighbor"], correctIndex: 0 },
        { question: "Who did Ranjit invite to join them?", options: ["Tapan", "Deben's wife", "A stranger"], correctIndex: 0 },
        { question: "What did they talk about?", options: ["The harvest season", "The weather", "Their children"], correctIndex: 0 }
      ]
    },
    {
      id: "l3_s10",
      text: "Doni and his daughter Ashi visited Doni's old friend Karma in Itanagar. Karma's wife Lobsang prepared a large meal of thukpa and bamboo shoot pickle for the guests. Ashi played with Karma's younger daughter while the adults talked. Before leaving, Doni thanked Karma and Lobsang for their kindness and promised to visit again soon.",
      questions: [
        { question: "Who did Doni and Ashi visit?", options: ["Karma", "Lobsang", "A neighbor"], correctIndex: 0 },
        { question: "Where did they visit?", options: ["Itanagar", "Kohima", "Guwahati"], correctIndex: 0 },
        { question: "What did Lobsang prepare?", options: ["Thukpa and bamboo shoot pickle", "Fish tenga", "Momos and tea"], correctIndex: 0 },
        { question: "Who did Ashi play with?", options: ["Karma's younger daughter", "Lobsang", "No one"], correctIndex: 0 },
        { question: "What did Doni promise before leaving?", options: ["To visit again soon", "To send money", "To bring gifts next time"], correctIndex: 0 }
      ]
    }
  ],

  4: [
    {
      id: "l4_s1",
      text: "Ratan and his wife Mona lived in a small house near Kohima with their two children, Bikash and Ashi. Every Sunday, the family visited the weekly market together. One Sunday, Ratan bought a basket of oranges while Mona chose fresh vegetables from an old seller named Vilie. Bikash wanted a new umbrella because the rainy season was starting, so Mona bought him one. On the way home, they stopped at a small stall to eat pitha and drink tea. Ashi was tired from walking, so Ratan carried her the rest of the way. When they reached home, the whole family sat together and shared the oranges Ratan had bought.",
      questions: [
        { question: "Where did Ratan and Mona live?", options: ["Near Kohima", "Near Shillong", "Near Imphal"], correctIndex: 0 },
        { question: "What did the family do every Sunday?", options: ["Visit the weekly market", "Visit relatives", "Go fishing"], correctIndex: 0 },
        { question: "Who did Mona buy vegetables from?", options: ["Vilie", "Bikash", "Ratan"], correctIndex: 0 },
        { question: "Why did Bikash need an umbrella?", options: ["Rainy season was starting", "He lost his old one", "It was a gift"], correctIndex: 0 },
        { question: "What did they eat at the stall?", options: ["Pitha and tea", "Momos", "Fish tenga"], correctIndex: 0 },
        { question: "Who carried Ashi home?", options: ["Ratan", "Mona", "Bikash"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s2",
      text: "Deben and his wife Ruma ran a small tea stall on the outskirts of Guwahati, and their daughter Priya often helped them after school. One evening, an old friend named Tapan visited with his son Arjun, who was the same age as Priya. Ruma made a special pot of tea and served pitha to welcome them. While the adults talked about old times, Priya and Arjun played near the garden. Tapan mentioned he was moving to Dimapur for work, which made Deben feel a little sad. Before leaving, Tapan promised to visit again whenever he came back to Guwahati. Priya was happy to have made a new friend that evening.",
      questions: [
        { question: "Where did Deben and Ruma's tea stall stand?", options: ["Guwahati", "Dimapur", "Shillong"], correctIndex: 0 },
        { question: "Who visited them that evening?", options: ["Tapan and his son Arjun", "Vilie", "Bikash"], correctIndex: 0 },
        { question: "What did Ruma serve?", options: ["Tea and pitha", "Momos", "Thukpa"], correctIndex: 0 },
        { question: "What did Priya and Arjun do?", options: ["Played near the garden", "Went to the market", "Watched television"], correctIndex: 0 },
        { question: "Where was Tapan moving to?", options: ["Dimapur", "Aizawl", "Itanagar"], correctIndex: 0 },
        { question: "How did Deben feel about the news?", options: ["A little sad", "Very angry", "Excited"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s3",
      text: "Nokchan lived in a small village near Kohima with his wife Aben, his younger brother Sanen, and their elderly mother. One morning, Aben cooked khar using vegetables Sanen had brought from the field the day before. While the family was eating breakfast, their neighbor Vilie came to ask for some rice, as her own supply had run low. Nokchan gave her a bag of rice without hesitation, and she thanked the family warmly before leaving. Later that afternoon, Sanen went fishing near the river and returned with two fish for dinner. Their mother was pleased to see the family working together and said it reminded her of her own childhood in the village.",
      questions: [
        { question: "Where did Nokchan and his family live?", options: ["Near Kohima", "Near Shillong", "Near Guwahati"], correctIndex: 0 },
        { question: "Who cooked breakfast?", options: ["Aben", "Sanen", "The mother"], correctIndex: 0 },
        { question: "What did Aben cook?", options: ["Khar", "Pitha", "Thukpa"], correctIndex: 0 },
        { question: "Why did Vilie come to their house?", options: ["To ask for rice", "To ask for fish", "To ask for tea"], correctIndex: 0 },
        { question: "What did Sanen do that afternoon?", options: ["Went fishing", "Went to the market", "Went to school"], correctIndex: 0 },
        { question: "What did the family's mother say?", options: ["It reminded her of her childhood", "She was tired", "She wanted more rice"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s4",
      text: "Toshi and his wife Diki lived in Dimapur with their two children. One weekend, they decided to visit Diki's parents, who lived a short distance away. Diki's mother had prepared a large lunch of thukpa and bamboo shoot curry for the whole family. While the food was being prepared, Diki's father took the children to see the local market, where they bought a small toy each. When they returned, the family sat together and enjoyed the meal, sharing stories about the children's school and upcoming exams. Toshi mentioned that he might get a new job soon, which made everyone at the table very happy.",
      questions: [
        { question: "Where did Toshi and Diki live?", options: ["Dimapur", "Kohima", "Imphal"], correctIndex: 0 },
        { question: "Whose parents did they visit?", options: ["Diki's parents", "Toshi's parents", "Their neighbor's parents"], correctIndex: 0 },
        { question: "What did Diki's mother prepare?", options: ["Thukpa and bamboo shoot curry", "Khar and rice", "Momos and tea"], correctIndex: 0 },
        { question: "Who took the children to the market?", options: ["Diki's father", "Toshi", "Diki"], correctIndex: 0 },
        { question: "What did they buy at the market?", options: ["A small toy each", "Fruits", "Clothes"], correctIndex: 0 },
        { question: "What news did Toshi share?", options: ["He might get a new job", "He was moving away", "He was sick"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s5",
      text: "Ibemhal and her brother Sanajaoba lived in Imphal with their grandmother, who had raised them since they were young. One evening, their grandmother asked Ibemhal to cook dinner while she rested after a long day. Ibemhal decided to make fish tenga using fish that Sanajaoba had bought earlier that morning from the market. While she was cooking, their neighbor Ngangbi stopped by to return a borrowed umbrella and was invited to stay for dinner. Everyone gathered around the table and enjoyed the warm meal together, thanking Ibemhal for her cooking. Their grandmother smiled and said the food reminded her of meals she used to cook for her own children.",
      questions: [
        { question: "Where did Ibemhal and Sanajaoba live?", options: ["Imphal", "Shillong", "Aizawl"], correctIndex: 0 },
        { question: "Who asked Ibemhal to cook dinner?", options: ["Their grandmother", "Sanajaoba", "Ngangbi"], correctIndex: 0 },
        { question: "What did Ibemhal cook?", options: ["Fish tenga", "Khar", "Pitha"], correctIndex: 0 },
        { question: "When did Sanajaoba buy the fish?", options: ["That morning", "The night before", "A week earlier"], correctIndex: 0 },
        { question: "Why did Ngangbi stop by?", options: ["To return a borrowed umbrella", "To borrow rice", "To visit"], correctIndex: 0 },
        { question: "What did their grandmother say about the food?", options: ["It reminded her of meals she used to cook", "It was too spicy", "It needed more salt"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s6",
      text: "Kevi and his wife Sentila owned a small orchard near Kohima where they grew kiwi and passion fruit. Every harvest season, their daughter Neikho came home from the city to help with the picking. This year, a fruit trader named Vilato visited to negotiate a bulk purchase of kiwi for the city market. Kevi and Sentila agreed to sell him a large basket, though they kept some fruit aside for the family. Neikho spent the afternoon packing baskets while telling her parents stories about her life in the city. Before leaving, Vilato promised to return next season for another purchase.",
      questions: [
        { question: "What did Kevi and Sentila grow?", options: ["Kiwi and passion fruit", "Litchi and oranges", "Star fruit and pineapple"], correctIndex: 0 },
        { question: "Who came home to help with picking?", options: ["Neikho", "Vilato", "Sentila's sister"], correctIndex: 0 },
        { question: "Who visited to buy fruit in bulk?", options: ["Vilato", "Neikho's friend", "A neighbor"], correctIndex: 0 },
        { question: "What did Kevi and Sentila keep aside?", options: ["Some fruit for the family", "Nothing", "All the passion fruit"], correctIndex: 0 },
        { question: "What did Neikho do in the afternoon?", options: ["Packed baskets and told stories", "Went to the market", "Rested"], correctIndex: 0 },
        { question: "What did Vilato promise?", options: ["To return next season", "To pay more next time", "To bring his family"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s7",
      text: "Lalawmpuia and his wife Zoremi lived in Aizawl with their son Malsawma, who was preparing for his school exams. One weekend, Zoremi's sister Rinsangi came to visit along with her husband and their two children. Malsawma was excited to see his cousins and spent the afternoon playing with them instead of studying. Zoremi prepared a large meal of pitha and orange juice to welcome the guests. Lalawmpuia gently reminded Malsawma about his exams, and the boy promised to study extra hard the next day. Before leaving, Rinsangi thanked Zoremi warmly for her hospitality and invited the family to visit them next month.",
      questions: [
        { question: "Where did Lalawmpuia and Zoremi live?", options: ["Aizawl", "Kohima", "Dimapur"], correctIndex: 0 },
        { question: "Who came to visit?", options: ["Zoremi's sister Rinsangi and her family", "A neighbor", "Zoremi's parents"], correctIndex: 0 },
        { question: "What was Malsawma preparing for?", options: ["School exams", "A competition", "A trip"], correctIndex: 0 },
        { question: "What did Malsawma do instead of studying?", options: ["Played with his cousins", "Slept", "Watched television"], correctIndex: 0 },
        { question: "What did Zoremi prepare?", options: ["Pitha and orange juice", "Thukpa", "Momos"], correctIndex: 0 },
        { question: "What did Rinsangi invite the family to do?", options: ["Visit them next month", "Move to Aizawl", "Come for dinner tomorrow"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s8",
      text: "Bidya and her husband Ranjit ran a small tea garden near Guwahati, where their worker Tapan came every morning to help pick tea leaves. One afternoon, Bidya's brother Deben visited unexpectedly, bringing a basket of fresh litchi from his own farm. Ranjit invited Tapan to join them for tea and litchi under the shade of a large tree. As they sat together, Deben shared news that he was planning to expand his farm and asked Ranjit for advice on growing fruit trees. Ranjit happily shared what he knew, and by the end of the visit, Deben felt confident about his new plans.",
      questions: [
        { question: "What did Bidya and Ranjit run?", options: ["A tea garden", "A fruit orchard", "A fish farm"], correctIndex: 0 },
        { question: "Who came every morning to help pick leaves?", options: ["Tapan", "Deben", "Bidya's son"], correctIndex: 0 },
        { question: "Who visited unexpectedly?", options: ["Bidya's brother Deben", "Ranjit's friend", "A neighbor"], correctIndex: 0 },
        { question: "What did Deben bring?", options: ["A basket of fresh litchi", "Oranges", "Star fruit"], correctIndex: 0 },
        { question: "What news did Deben share?", options: ["He was planning to expand his farm", "He was moving away", "He lost his job"], correctIndex: 0 },
        { question: "What did Ranjit do?", options: ["Shared advice on growing fruit trees", "Refused to help", "Ignored him"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s9",
      text: "Doni and his daughter Ashi traveled to Itanagar to visit Doni's old friend Karma, whom he had not seen in many years. Karma's wife Lobsang welcomed them warmly and prepared a large meal of thukpa and bamboo shoot pickle. While the adults caught up on old memories, Ashi played with Karma's younger daughter in the garden. During the conversation, Karma mentioned that his son was studying in another city and would be visiting soon. Doni was happy to hear this and suggested that both families meet again when Karma's son returned. Before leaving, Doni thanked Karma and Lobsang for their generous hospitality.",
      questions: [
        { question: "Who did Doni and Ashi visit?", options: ["Karma", "Lobsang", "A neighbor"], correctIndex: 0 },
        { question: "Where did they visit?", options: ["Itanagar", "Kohima", "Guwahati"], correctIndex: 0 },
        { question: "What did Lobsang prepare?", options: ["Thukpa and bamboo shoot pickle", "Fish tenga", "Momos and tea"], correctIndex: 0 },
        { question: "Who did Ashi play with?", options: ["Karma's younger daughter", "Lobsang", "No one"], correctIndex: 0 },
        { question: "What news did Karma share?", options: ["His son was studying elsewhere and visiting soon", "He was moving", "He was retiring"], correctIndex: 0 },
        { question: "What did Doni suggest?", options: ["Both families meet again when Karma's son returned", "Never meet again", "Move closer"], correctIndex: 0 }
      ]
    },
    {
      id: "l4_s10",
      text: "Sentila and her husband Kevi lived near an orchard where their daughter Neikho often visited during harvest season. This year, Sentila's cousin Vilie arrived from a nearby village bringing a basket of star fruit as a gift. Neikho was delighted and suggested they all have a small gathering that evening. Kevi invited their neighbor Tapan and his family to join, and together they prepared a simple meal using fruits from the orchard. As the evening went on, Vilie shared stories about her village, and everyone listened closely, enjoying the cool evening breeze. Before leaving, Vilie promised to visit again during the next harvest season.",
      questions: [
        { question: "Where did Sentila and Kevi live?", options: ["Near an orchard", "Near a river", "Near a market"], correctIndex: 0 },
        { question: "Who arrived with a gift of star fruit?", options: ["Sentila's cousin Vilie", "Neikho", "Tapan"], correctIndex: 0 },
        { question: "What did Neikho suggest?", options: ["A small gathering that evening", "A trip to the market", "Going fishing"], correctIndex: 0 },
        { question: "Who did Kevi invite to join?", options: ["Their neighbor Tapan and his family", "Vilato", "No one"], correctIndex: 0 },
        { question: "What did Vilie share?", options: ["Stories about her village", "News about the harvest", "A recipe"], correctIndex: 0 },
        { question: "What did Vilie promise before leaving?", options: ["To visit again during the next harvest season", "To move nearby", "To send more fruit"], correctIndex: 0 }
      ]
    }
  ]
};

// If using ES modules:
// export default storyContent;
// If using a plain <script> tag (no bundler), storyContent is available as a global.
