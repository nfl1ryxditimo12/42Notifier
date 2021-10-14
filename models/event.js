const Sequelize = require("sequelize");

module.exports = class Event extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                location: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                max_people: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                begin_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                end_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                themes: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Event",
                tableName: "events",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
};
