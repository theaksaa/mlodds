'use strict'

const fp = require('fastify-plugin')
const Team = require("../models/Team");
const DECIMALS = 2;

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('updateTeamsPositions', async (teams, votes) => {
        for(let i = 0; i < teams.length; i++) {
            let team = await Team.findOne({ "_id": teams[i].id });
            team.prevPosition = i + 1;
            team.points += votes[team.id];
            await team.save();
        }
    });
    
    fastify.decorate('getTeams', async function() {
        let rawData = await Team.find({ });
        let data = [];

        let totalPoints = rawData.reduce((acc, team) => { return acc + team.points }, 0);
        let maxPercentage = rawData.reduce((acc, team) => { return Math.max(acc, parseFloat((team.points * 100.0) / totalPoints).toFixed(DECIMALS)) }, 0);

        for(let team of rawData) {
            let id = team["_id"].toString();
            let percentage = parseFloat((team.points * 100.0) / totalPoints).toFixed(DECIMALS);
            let power = parseFloat((percentage * 100.0) / maxPercentage).toFixed(DECIMALS);
            data.push({
                id: id, 
                name: team.name,
                points: team.points,
                percentage: percentage,
                power: power,
                image: team.image,
                color: team.color,
                prevPosition: team.prevPosition,
                positionChange: 0
            });
        }

        data.sort((a, b) => {
            if(a.points <= b.points) return 1;
            return -1;
        });

        for(let i = 0; i < data.length; i++) {
            data[i].positionChange = data[i].prevPosition - (i + 1);
        }
        return { teams: data, totalPoints };
    });

    fastify.decorate('refreshTeamsData', async (votes) => {        
        await fastify.updateTeamsPositions(fastify.teamsData.teams, votes);

        let { teams, totalPoints } = await fastify.getTeams();
        fastify.teamsData = { teams, totalPoints };
    });

    fastify.decorate('teamsData', { teams: {}, totalPoints: 0 });

    fastify.teamsData = await fastify.getTeams();
})