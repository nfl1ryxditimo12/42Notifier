const Sequelize = require("sequelize");

module.exports = class Token extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                eventToken: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                eventCreatedAt: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                eventExpiresIn: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                examToken: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                examCreatedAt: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                examExpiresIn: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Token",
                tableName: "tokens",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
};
