const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
       
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

// Get game history for a user
exports.getGameHistory = async (req, res) => {
    try {
        const { userID } = req.params;
        
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch game history sorted by date (most recent first)
        const gameHistory = await Save.find({ userID })
            .sort({ gameDate: -1 })
            .limit(20); // Limit to most recent 20 games

        // Format stats and return
        const formattedHistory = gameHistory.map(game => ({
            id: game._id,
            date: game.gameDate,
            difficulty: game.difficulty,
            failed: game.failed,
            completed: game.completed,
            timeTaken: game.timeTaken,
            // Add some calculated stats
            success: game.completed === 1,
            formattedTime: formatTime(game.timeTaken)
        }));
        
        // Calculate summary stats
        const totalGames = gameHistory.length;
        const completedGames = gameHistory.filter(game => game.completed === 1).length;
        const successRate = totalGames > 0 ? (completedGames / totalGames * 100).toFixed(1) : 0;
        
        // Group by difficulty
        const byDifficulty = {};
        gameHistory.forEach(game => {
            if (!byDifficulty[game.difficulty]) {
                byDifficulty[game.difficulty] = { total: 0, completed: 0 };
            }
            byDifficulty[game.difficulty].total += 1;
            if (game.completed === 1) {
                byDifficulty[game.difficulty].completed += 1;
            }
        });
        
        res.status(200).json({
            history: formattedHistory,
            stats: {
                totalGames,
                completedGames,
                successRate,
                byDifficulty
            }
        });
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Error fetching game history', error });
    }
};

// Helper function to format time in MM:SS format
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
