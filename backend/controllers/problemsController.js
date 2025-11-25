const fs = require('fs');
const path = require('path');

const problemsPath = path.join(__dirname, '../data/problems.json');
const visualizationsPath = path.join(__dirname, '../data/visualizations.json');

exports.getProblems = (req, res) => {
  try {
    const problems = JSON.parse(fs.readFileSync(problemsPath));
    const summary = problems.map(({ id, title, difficulty, tags }) => ({ id, title, difficulty, tags }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load problems.' });
  }
};

exports.getProblemById = (req, res) => {
  try {
    const problems = JSON.parse(fs.readFileSync(problemsPath));
    const problem = problems.find(p => p.id === req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found.' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load problem.' });
  }
};

exports.getVisualizationById = (req, res) => {
  try {
    const visualizations = JSON.parse(fs.readFileSync(visualizationsPath));
    const steps = visualizations[req.params.id];
    if (!steps) return res.status(404).json({ error: 'Visualization not found.' });
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load visualization.' });
  }
};
