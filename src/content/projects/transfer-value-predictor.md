---
title: Transfer Value Predictor
summary: A machine learning model that predicts a football player's market value from their performance data, then compares it to what they actually cost.
year: '2026'
order: 1
tags: [Python, pandas, scikit-learn, matplotlib, REST API]
---

- Pulled multi-season player statistics from the football-data.org API with the requests library, then cleaned and merged the data using pandas.
- Engineered features including goals and assists per 90, minutes played, age relative to peak, and position, and trained a linear regression model with scikit-learn.
- Visualized predicted vs. actual market values with matplotlib to identify under- and over-valued players.
