/**
 * 💕 LOVE GAME BOARD v2 - Questions Database
 * 80+ câu hỏi và thử thách + Couple Activities cho các cặp đôi
 * Với chức năng shuffle và overlap tile support
 */

// ============ CÂU HỎI THEO LOẠI (80+ câu) ============
const QUESTIONS = {
    // 💗 ROMANCE - Câu hỏi lãng mạn, kỷ niệm ngọt ngào (16 câu)
    romance: [
        "Kỷ niệm đẹp nhất của chúng ta mà em/anh luôn nhớ là gì?",
        "Lần đầu tiên gặp nhau, em/anh đã nghĩ gì về đối phương?",
        "Điều gì khiến em/anh quyết định yêu người này?",
        "Món quà nào từ đối phương khiến em/anh cảm động nhất?",
        "Nếu viết một bức thư tình, em/anh sẽ viết gì?",
        "Khoảnh khắc nào em/anh cảm thấy được yêu thương nhất?",
        "Em/Anh thích điều gì nhất ở nụ cười của đối phương?",
        "Nếu được quay lại ngày đầu tiên hẹn hò, em/anh sẽ làm gì?",
        "Bài hát nào khiến em/anh nghĩ đến đối phương?",
        "Điều lãng mạn nhất đối phương từng làm cho em/anh là gì?",
        "Em/Anh thích được ôm hay được hôn hơn?",
        "Nơi nào em/anh muốn đi du lịch cùng đối phương nhất?",
        "Nếu tổ chức lại lễ kỷ niệm, em/anh muốn như thế nào?",
        "Em/Anh yêu đối phương vì những lý do gì?",
        "Giấc mơ lãng mạn nhất về chúng ta mà em/anh từng mơ?",
        "Điều gì ở đối phương khiến tim em/anh đập nhanh hơn?",
    ],

    // 💙 DEEP - Câu hỏi sâu sắc về giá trị, tương lai (16 câu)
    deep: [
        "Điều gì quan trọng nhất trong một mối quan hệ theo em/anh?",
        "Em/Anh nghĩ điều gì đã thay đổi ở bản thân kể từ khi yêu?",
        "Nỗi sợ lớn nhất của em/anh trong tình yêu là gì?",
        "Em/Anh mong muốn cuộc sống của chúng ta 10 năm sau như thế nào?",
        "Điều gì khiến em/anh cảm thấy an toàn trong mối quan hệ này?",
        "Nếu có một điều muốn thay đổi ở chúng ta, đó là gì?",
        "Em/Anh định nghĩa thế nào là tình yêu đích thực?",
        "Gia đình trong mơ của em/anh như thế nào?",
        "Điều gì khiến em/anh tự hào nhất về mối quan hệ này?",
        "Em/Anh muốn được nhớ đến như thế nào khi già đi?",
        "Nếu phải đối mặt với khó khăn lớn, em/anh muốn được hỗ trợ thế nào?",
        "Điều gì em/anh chưa bao giờ kể cho ai, kể cả đối phương?",
        "Giá trị sống quan trọng nhất mà em/anh muốn truyền cho con cái?",
        "Em/Anh nghĩ đâu là thử thách lớn nhất mà chúng ta đã vượt qua?",
        "Nếu chỉ có 24 giờ cuối cùng, em/anh sẽ làm gì cùng đối phương?",
        "Điều gì em/anh học được từ mối quan hệ này?",
    ],

    // 💛 FUN - Câu hỏi vui nhộn, hài hước (18 câu)
    fun: [
        "Nếu được đổi thân 1 ngày với đối phương, em/anh sẽ làm gì đầu tiên?",
        "Thói quen kỳ quặc nào của đối phương khiến em/anh phát điên?",
        "Nếu chúng ta có show truyền hình riêng, tên show là gì?",
        "Biệt danh bí mật em/anh đặt cho đối phương là gì?",
        "Điều ngớ ngẩn nhất em/anh từng làm vì yêu?",
        "Nếu đối phương là một món ăn, đó sẽ là món gì?",
        "Ai trong hai người ngủ dậy muộn hơn và ai ngáy to hơn?",
        "Nếu bị mắc kẹt trên đảo hoang cùng nhau, ai sẽ sống sót lâu hơn?",
        "Điều gì đối phương làm khiến em/anh cười nhiều nhất?",
        "Nếu được chọn superpower cho đối phương, em/anh chọn gì?",
        "Ai nấu ăn ngon hơn và ai rửa bát giỏi hơn?",
        "Câu nói hay hành động nào của đối phương khiến em/anh cringe nhất?",
        "Nếu viết tiểu thuyết về chúng ta, tiêu đề sẽ là gì?",
        "Điều bí mật nào về đối phương mà em/anh vô tình phát hiện?",
        "Nếu đối phương là một con vật, đó sẽ là con gì?",
        "Cặp đôi nổi tiếng nào giống chúng ta nhất?",
        "Nếu có robot thay thế đối phương 1 ngày, em/anh có phát hiện không?",
        "Điều kỳ lạ nhất em/anh từng search Google về đối phương?",
    ],

    // 💜 INTIMATE - Câu hỏi thân mật, mong muốn cá nhân (24 câu - bao gồm 18+)
    intimate: [
        "Điều gì làm em/anh cảm thấy được yêu thương và trân trọng nhất?",
        "Em/Anh thích được âu yếm theo cách nào nhất?",
        "Khi nào em/anh cảm thấy gần gũi với đối phương nhất?",
        "Điều gì ở đối phương khiến em/anh thấy hấp dẫn nhất?",
        "Em/Anh muốn được lắng nghe hay được ôm khi buồn?",
        "Fantasy date lý tưởng của em/anh là như thế nào?",
        "Điều gì em/anh ước đối phương làm thường xuyên hơn?",
        "Khi nào em/anh cảm thấy sexy nhất?",
        "Em/Anh thích nói 'Anh yêu em' hay thể hiện bằng hành động?",
        "Điều gì khiến em/anh cảm thấy được kết nối sâu sắc với đối phương?",
        "Ngôn ngữ tình yêu của em/anh là gì? (Lời nói, hành động, quà tặng, thời gian, tiếp xúc)",
        "Em/Anh cảm thấy thế nào khi đối phương khen ngợi trước mặt người khác?",
        "Điều gì em/anh cần từ đối phương để cảm thấy được an ủi?",
        "Mùi hương nào của đối phương khiến em/anh thấy thư giãn nhất?",
        // 🔥 18+ INTIMATE - Dành cho cặp đôi
        "Vùng nào trên cơ thể em/anh nhạy cảm nhất khi được chạm vào?",
        "Điều gì đối phương làm trên giường khiến em/anh 'phát điên'?",
        "Fantasy 18+ nào em/anh muốn thử cùng đối phương?",
        "Em/Anh thích được chủ động hay để đối phương dẫn dắt?",
        "Outfit/trang phục nào của đối phương khiến em/anh 'nóng' nhất?",
        "Thời điểm nào trong ngày em/anh cảm thấy 'muốn' nhất?",
        "Điều gì đối phương có thể làm ngay bây giờ để khiến em/anh bật mode 'on'?",
        "Em/Anh thích foreplay lâu hay đi thẳng vào 'trận chiến'?",
        "Nơi kỳ lạ nhất mà em/anh muốn thử 'làm chuyện ấy' là ở đâu?",
        "Điều em/anh muốn đối phương làm với cơ thể mình tối nay?",
    ],

    // 🔥 DARE - Thử thách hành động (26 câu - bao gồm 18+)
    dare: [
        "Hãy hát một bài hát tình yêu cho đối phương nghe!",
        "Nhảy một điệu nhảy sexy trong 30 giây!",
        "Hôn đối phương theo 3 cách khác nhau!",
        "Kể 5 điều em/anh yêu ở đối phương trong 1 phút!",
        "Massage vai cho đối phương trong 2 phút!",
        "Nhìn vào mắt nhau 1 phút không được cười!",
        "Làm mặt đáng yêu nhất có thể để đối phương chụp ảnh!",
        "Diễn lại cảnh cầu hôn (thật hoặc tưởng tượng)!",
        "Viết một tin nhắn tình yêu lên tay đối phương!",
        "Ôm đối phương thật chặt trong 1 phút và nói điều em/anh biết ơn!",
        "Cho đối phương ăn một món gì đó bằng tay!",
        "Làm điệu 'aegyo' cute nhất có thể!",
        "Nói 10 từ ngọt ngào bắt đầu bằng chữ cái tên đối phương!",
        "Làm voice message tỏ tình như lần đầu gặp nhau!",
        "Đóng vai đối phương trong 1 phút!",
        "Thì thầm điều em/anh muốn làm cùng đối phương tối nay!",
        // 🔥 18+ DARE - Dành cho cặp đôi
        "Massage toàn thân cho đối phương trong 3 phút! (Càng sensual càng tốt)",
        "Hôn đối phương ở 5 vị trí khác nhau trên cơ thể!",
        "Cởi 1 món đồ trên người và nói điều sexy mình thích ở đối phương!",
        "Thì thầm vào tai đối phương điều 18+ em/anh muốn làm!",
        "Lap dance cho đối phương trong 1 phút!",
        "Để đối phương vẽ/viết gì đó lên người mình bằng ngón tay!",
        "Mút ngón tay đối phương một cách gợi cảm!",
        "Diễn cảnh phim hành động 18+ em/anh muốn thử (không cởi đồ)!",
        "Hôn cổ đối phương trong 30 giây!",
        "Để đối phương làm bất cứ điều gì với cơ thể mình trong 2 phút!",
    ],
};

// ============ COUPLE ACTIVITIES - Hoạt động cặp đôi cho ô OVERLAP ============
const COUPLE_ACTIVITIES = [
    {
        title: "Staring Contest 👀",
        description: "Nhìn vào mắt nhau 60 giây không được cười. Ai cười trước bị phạt hôn!",
        duration: 60,
    },
    {
        title: "Slow Dance 💃",
        description: "Bật một bài nhạc và slow dance cùng nhau. Không cần biết nhảy, chỉ cần ôm nhau!",
        duration: 120,
    },
    {
        title: "Massage Time 💆",
        description: "Massage vai và lưng cho nhau, mỗi người 2 phút!",
        duration: 240,
    },
    {
        title: "Confession Time 💕",
        description: "Lần lượt nói 3 điều em/anh yêu ở đối phương mà chưa từng nói!",
        duration: 60,
    },
    {
        title: "Forehead Kiss 😘",
        description: "Hôn trán nhau và nói 'Em/Anh rất quan trọng với anh/em'!",
        duration: 30,
    },
    {
        title: "Hand Holding 🤝",
        description: "Nắm tay nhau, nhắm mắt, và chia sẻ một bí mật nhỏ!",
        duration: 60,
    },
    {
        title: "Compliment Battle 🎤",
        description: "Thi nhau khen đối phương! Ai hết lời khen trước thì thua!",
        duration: 120,
    },
    {
        title: "Memory Lane 📸",
        description: "Cùng nhau xem lại ảnh cũ và kể chuyện ngày xưa!",
        duration: 180,
    },
    {
        title: "Future Dream 🌟",
        description: "Chia sẻ 1 giấc mơ về tương lai mà em/anh muốn cùng đối phương thực hiện!",
        duration: 60,
    },
    {
        title: "Butterfly Kisses 🦋",
        description: "Chớp mắt lên má đối phương để tạo cảm giác như cánh bướm!",
        duration: 30,
    },
    {
        title: "Blindfold Guess 🙈",
        description: "Một người bịt mắt, người kia cho sờ mặt và đoán đang có biểu cảm gì!",
        duration: 60,
    },
    {
        title: "Whisper Challenge 🤫",
        description: "Thì thầm điều em/anh thích nhất ở đối phương vào tai!",
        duration: 30,
    },
];

// ============ 18+ COUPLE ACTIVITIES - Hoạt động 18+ cho ô OVERLAP (30-35% ưu tiên) ============
const COUPLE_ACTIVITIES_18PLUS = [
    {
        title: "Sensual Massage 💆🔥",
        description: "Massage toàn thân cho đối phương 5 phút - càng sensual càng tốt!",
        duration: 300,
    },
    {
        title: "Whisper Fantasy 🤫🔥",
        description: "Thì thầm vào tai đối phương điều 18+ em/anh muốn làm tối nay!",
        duration: 60,
    },
    {
        title: "Body Trace 👆🔥",
        description: "Dùng ngón tay vẽ chữ 'I LOVE YOU' lên người đối phương (không áo)!",
        duration: 60,
    },
    {
        title: "Neck Kisses 💋🔥",
        description: "Hôn cổ đối phương trong 1 phút liên tục!",
        duration: 60,
    },
    {
        title: "Lap Dance Challenge 💃🔥",
        description: "Lap dance cho đối phương trong 2 phút với bài hát yêu thích!",
        duration: 120,
    },
    {
        title: "Strip Tease Lite 👕🔥",
        description: "Cởi 1 món đồ một cách gợi cảm và nói điều sexy nhất về đối phương!",
        duration: 60,
    },
    {
        title: "Blindfold Touch 🙈🔥",
        description: "Bịt mắt đối phương và chạm vào họ ở 5 vị trí khác nhau - họ phải đoán!",
        duration: 120,
    },
    {
        title: "Ice Cube Play 🧊🔥",
        description: "Dùng một viên đá lạnh di chuyển trên cơ thể đối phương!",
        duration: 90,
    },
];

// ============ PUNISHMENT - Hình phạt khi từ chối ============
const PUNISHMENTS = [
    "Phải nghe lời đối phương 10 phút tiếp theo!",
    "Làm 10 cái squat ngay lập tức!",
    "Post story ảnh selfie hai người với caption do đối phương chọn!",
    "Không được dùng điện thoại 15 phút!",
    "Phải gọi đối phương bằng cách ngọt ngào suốt trận!",
    "Làm aegyo 3 lần liên tiếp!",
    "Nhảy điệu nhảy mà đối phương chọn!",
    "Kể 1 bí mật chưa từng nói cho đối phương!",
    "Massage chân đối phương 3 phút!",
    "Hát 1 bài karaoke do đối phương chọn!",
];

// ============ REVENGE - Phạt ngược khi đủ 3 penalty ============
const REVENGE_OPTIONS = [
    "Bắt đối phương làm bất kỳ điều gì trong 5 phút!",
    "Đối phương phải chiều theo 3 yêu cầu liên tiếp!",
    "Đối phương phải làm 1 video TikTok theo ý bạn!",
    "Đối phương phải nấu/mua đồ ăn cho bạn!",
    "Đối phương phải massage toàn thân cho bạn 10 phút!",
];

// ============ TILE CONFIGURATION - 30 ô mỗi lane ============
// Overlap tiles: ô 8, 15, 22 (0-indexed: 7, 14, 21)
const TILE_CONFIG = generateTileConfig();

function generateTileConfig() {
    const tiles = [];
    const types = ['romance', 'deep', 'fun', 'intimate', 'dare'];
    const overlapPositions = [8, 15, 22]; // Các ô overlap
    const specialPositions = { 5: 'bonus', 12: 'pause', 19: 'swap', 26: 'bonus' };

    // Ô Start
    tiles.push({ type: 'start', icon: '🏠', isOverlap: false });

    // 30 ô chính
    for (let i = 1; i <= 30; i++) {
        let tile;

        if (overlapPositions.includes(i)) {
            // Ô Overlap - nơi 2 lane gặp nhau
            tile = { type: 'overlap', icon: '💑', isOverlap: true, overlapIndex: overlapPositions.indexOf(i) };
        } else if (specialPositions[i]) {
            // Ô đặc biệt
            tile = { type: specialPositions[i], icon: getSpecialIcon(specialPositions[i]), isOverlap: false };
        } else {
            // Ô câu hỏi thông thường - phân bố đều các loại
            const typeIndex = (i - 1) % types.length;
            tile = { type: types[typeIndex], icon: '', isOverlap: false };
        }

        tiles.push(tile);
    }

    // Ô Finish
    tiles.push({ type: 'finish', icon: '🏁', isOverlap: false });

    return tiles;
}

function getSpecialIcon(type) {
    const icons = { bonus: '⭐', pause: '⏸️', swap: '🔄', overlap: '💑' };
    return icons[type] || '';
}

// Ô đặc biệt descriptions
const SPECIAL_TILES = {
    bonus: {
        icon: "⭐",
        title: "Bonus Star!",
        description: "Tuyệt vời! Bạn được đi thêm 1 ô nữa! 🌟",
    },
    swap: {
        icon: "🔄",
        title: "Swap Places!",
        description: "Hai người đổi vị trí cho nhau! Có thể là cơ hội hoặc thử thách! 😄",
    },
    pause: {
        icon: "⏸️",
        title: "Pause & Kiss!",
        description: "Nghỉ 1 lượt... nhưng được hôn đối phương! 💋",
    },
    overlap: {
        icon: "💑",
        title: "Điểm Hẹn Tình Yêu!",
        description: "Đây là nơi hai người có thể gặp nhau! 💕",
    },
    trap_back: {
        icon: "🕳️",
        title: "Hố Bẫy! 🕳️",
        description: "Lùi 2 ô! Và phải làm 10 cái squat hoặc hát 1 đoạn nhạc! 💪",
        challenge: "10 squats hoặc hát 1 phút!"
    },
    trap_skip: {
        icon: "⏭️",
        title: "Bẫy Đóng Băng! ❄️",
        description: "Nghỉ lượt! Nhưng đối phương được quyền vẽ bất cứ thứ gì lên mặt bạn! 🎨",
        challenge: "Để đối phương vẽ lên mặt!"
    },
    trap_spin: {
        icon: "🎰",
        title: "Vòng Quay May Mắn! 🎰",
        description: "Roll lại! Nhưng trước tiên phải uống 1 shot nước hoặc làm động tác hài hước! 🍹",
        challenge: "Uống 1 shot hoặc làm mặt hề!"
    },
};

// Category info for modal (cho ô Monopoly style)
const CATEGORY_INFO = {
    romance: { icon: "💗", name: "Lãng Mạn", color: "#ff6b9d" },
    deep: { icon: "💙", name: "Sâu Sắc", color: "#667eea" },
    fun: { icon: "💛", name: "Vui Nhộn", color: "#f7b731" },
    intimate: { icon: "💜", name: "Thân Mật", color: "#a55eea" },
    dare: { icon: "🔥", name: "Thử Thách", color: "#ff4757" },
    overlap: { icon: "💑", name: "Điểm Hẹn", color: "#2ed573" },
};

// ============ SHUFFLE FUNCTIONS ============

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Shuffle all question categories
 */
function shuffleAllQuestions() {
    const shuffledQuestions = {};
    for (const category in QUESTIONS) {
        shuffledQuestions[category] = shuffleArray(QUESTIONS[category]);
    }
    return shuffledQuestions;
}

// Lưu trữ câu hỏi đã shuffle và index hiện tại
let shuffledQuestions = shuffleAllQuestions();
let questionIndices = {
    romance: 0,
    deep: 0,
    fun: 0,
    intimate: 0,
    dare: 0,
};

/**
 * Lấy câu hỏi tiếp theo (không trùng lặp cho đến khi hết)
 */
function getNextQuestion(type) {
    if (!shuffledQuestions[type]) {
        return "Hãy chia sẻ một điều về bản thân mình!";
    }

    const questions = shuffledQuestions[type];
    const index = questionIndices[type];

    // Nếu đã hết câu hỏi, shuffle lại
    if (index >= questions.length) {
        shuffledQuestions[type] = shuffleArray(QUESTIONS[type]);
        questionIndices[type] = 0;
    }

    const question = shuffledQuestions[type][questionIndices[type]];
    questionIndices[type]++;

    return question;
}

/**
 * Reset và shuffle lại tất cả câu hỏi (khi chơi lại)
 */
function resetAndShuffleQuestions() {
    shuffledQuestions = shuffleAllQuestions();
    questionIndices = {
        romance: 0,
        deep: 0,
        fun: 0,
        intimate: 0,
        dare: 0,
    };
}

/**
 * Lấy couple activity ngẫu nhiên (30-35% chance cho 18+ activities)
 */
function getRandomCoupleActivity() {
    // 30-35% chance for 18+ activity
    const is18Plus = Math.random() < 0.33;

    if (is18Plus && COUPLE_ACTIVITIES_18PLUS.length > 0) {
        return COUPLE_ACTIVITIES_18PLUS[Math.floor(Math.random() * COUPLE_ACTIVITIES_18PLUS.length)];
    }
    return COUPLE_ACTIVITIES[Math.floor(Math.random() * COUPLE_ACTIVITIES.length)];
}

/**
 * Lấy punishment ngẫu nhiên
 */
function getRandomPunishment() {
    return PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
}

/**
 * Lấy revenge option ngẫu nhiên
 */
function getRandomRevenge() {
    return REVENGE_OPTIONS[Math.floor(Math.random() * REVENGE_OPTIONS.length)];
}

/**
 * Kiểm tra ô có phải ô đặc biệt không (bao gồm traps)
 */
function isSpecialTile(type) {
    return ["bonus", "swap", "pause", "trap_back", "trap_skip", "trap_spin"].includes(type);
}

/**
 * Kiểm tra ô có phải ô overlap không
 */
function isOverlapTile(type) {
    return type === "overlap";
}

/**
 * Lấy thông tin ô đặc biệt
 */
function getSpecialTileInfo(type) {
    return SPECIAL_TILES[type] || null;
}

// Export for use in game.js
window.QUESTIONS = QUESTIONS;
window.COUPLE_ACTIVITIES = COUPLE_ACTIVITIES;
window.PUNISHMENTS = PUNISHMENTS;
window.REVENGE_OPTIONS = REVENGE_OPTIONS;
window.TILE_CONFIG = TILE_CONFIG;
window.CATEGORY_INFO = CATEGORY_INFO;
window.SPECIAL_TILES = SPECIAL_TILES;
window.getNextQuestion = getNextQuestion;
window.resetAndShuffleQuestions = resetAndShuffleQuestions;
window.getRandomCoupleActivity = getRandomCoupleActivity;
window.getRandomPunishment = getRandomPunishment;
window.getRandomRevenge = getRandomRevenge;
window.isSpecialTile = isSpecialTile;
window.isOverlapTile = isOverlapTile;
window.getSpecialTileInfo = getSpecialTileInfo;
