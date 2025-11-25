const { executeCode } = require('../config/judge0');
const languageMap = require('../utils/languageMap');

exports.execute = async (req, res) => {
  try {
    const { language, code, input } = req.body;
    if (!language || !code) {
      return res.status(400).json({ error: 'Missing required fields: language, code.' });
    }
    const languageId = languageMap[language];
    if (!languageId) {
      return res.status(400).json({ error: 'Unsupported language.' });
    }
    const result = await executeCode({ languageId, code, input });
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Execution failed.' });
  }
};
