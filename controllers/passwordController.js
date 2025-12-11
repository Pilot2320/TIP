function generatePassword(length, sets) {
    let allChars = '';
    if (sets.upper) allChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (sets.lower) allChars += 'abcdefghijklmnopqrstuvwxyz';
    if (sets.digit) allChars += '0123456789';
    if (sets.symbol) allChars += '!@#$%&*';
    
    if (!allChars) return '';
    
    let pwd = '';
    let requiredChars = [];
    
    if (sets.upper) requiredChars.push(randChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    if (sets.lower) requiredChars.push(randChar('abcdefghijklmnopqrstuvwxyz'));
    if (sets.digit) requiredChars.push(randChar('0123456789'));
    if (sets.symbol) requiredChars.push(randChar('!@#$%&*'));
    
    for (let i = 0; i < length - requiredChars.length; ++i)
        pwd += randChar(allChars);
    
    pwd += requiredChars.join('');
    return shuffle(pwd.split('')).join('');
}

function randChar(chars) {
    return chars[Math.floor(Math.random() * chars.length)];
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function estimateStrength(password, sets) {
    let score = 0;
    if (sets.upper) score += 10;
    if (sets.lower) score += 10;
    if (sets.digit) score += 10;
    if (sets.symbol) score += 12;
    score += password.length * 2;
    if ([sets.upper, sets.lower, sets.digit, sets.symbol].filter(Boolean).length > 2)
        score += 10;
    
    if (score < 35) return { fill: 33, label: "Слабый пароль" };
    if (score < 54) return { fill: 60, label: "Средний пароль" };
    if (score < 70) return { fill: 80, label: "Хороший пароль" };
    return { fill: 100, label: "Надёжный пароль" };
}

function parseBoolean(value) {
    return value === 'true' || value === true;
}

exports.generatePasswordGet = (req, res) => {
    try {
        let length = parseInt(req.params.length, 10) || parseInt(req.query.length, 10);
        
        if (isNaN(length) || length < 6 || length > 32) {
            return res.status(400).json({ error: 'Длина пароля должна быть от 6 до 32 символов' });
        }

        const sets = {
            upper: parseBoolean(req.query.uppercase),
            lower: parseBoolean(req.query.lowercase),
            digit: parseBoolean(req.query.digits),
            symbol: parseBoolean(req.query.symbols)
        };

        if (!sets.upper && !sets.lower && !sets.digit && !sets.symbol) {
            return res.status(400).json({ error: 'Выберите хотя бы одну группу символов' });
        }

        const password = generatePassword(length, sets);
        const strength = estimateStrength(password, sets);

        res.json({ password, strength });
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

exports.generatePasswordPost = (req, res) => {
    try {
        const { length, uppercase, lowercase, digits, symbols } = req.body;
        
        const len = parseInt(length, 10);
        if (isNaN(len) || len < 6 || len > 32) {
            return res.status(400).json({ error: 'Длина пароля должна быть от 6 до 32 символов' });
        }

        const sets = {
            upper: parseBoolean(uppercase),
            lower: parseBoolean(lowercase),
            digit: parseBoolean(digits),
            symbol: parseBoolean(symbols)
        };

        if (!sets.upper && !sets.lower && !sets.digit && !sets.symbol) {
            return res.status(400).json({ error: 'Выберите хотя бы одну группу символов' });
        }

        const password = generatePassword(len, sets);
        const strength = estimateStrength(password, sets);

        res.json({ password, strength });
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
