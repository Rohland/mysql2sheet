const tasks = [
    {
        name: "Codeo Billing Time",
        connection: "local",
        schema: "busd",
        sql: `select 1 as id`,
        mapData: (x) => [x.id],
        type: 'scalar',
        clearRange: null,
        googleCredential: "codeostats",
        googleSheetId: "1O58NA9rqCNBnYeM4l7VyrLoZZmsjwFUzG_tjiwtaNqM",
        googleSheetRange: "TimeTracking!B2:B2",
    },
    {
        name: "Codeo Projects",
        connection: "local",
        schema: "reportio",
        sql: `select distinct name, version from windows limit 5`,
        mapData: (x) => [x.name, x.version],
        type: 'table',
        clearRange: true,
        googleCredential: "codeostats",
        googleSheetId: "1O58NA9rqCNBnYeM4l7VyrLoZZmsjwFUzG_tjiwtaNqM",
        googleSheetRange: "TimeTracking!E2:F",
    }
];

module.exports = {
    tasks: tasks,
    settings: {
        mysql: {
            local: {
                host: "localhost",
                user: "root",
                password: "root",
                port: "3306"
            }
        },
        google: {
            codeostats: {
                "type": "service_account",
                "project_id": "careful-airfoil-252908",
                "private_key_id": "5036508da24dad7dedb2436c5e40458a841be347",
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsdSvR9dEiNGJY\noqH2KpQkphkqI73hkaYELbo4XNC6P1YDguHpIADLM4nEhbUxg8a74mnqebRbBzyX\n0U6SLjN/cCsy4dUUTR/F9lVzVGjCdL9tlz2aDeevhwCsmKSuuotoyPk3+unzbTQm\nNxf4+45yUtieQjdqAcAulagKUG8AiMN6nSZGFEXrt5Myf/JUWXu5p9Hz30o+fypU\nscYXbiZaPGEYfvVcJEwepfXG0SL55ijgozci6DdKAX3Yz5sVL8E3rzVjpIH1Pwkm\noUtWAXDcmfee0CSfCDJsIUBfwry1tgh5eVVLnolp+XCJ/MxIoxDTYAy0mwY6vk+7\nZ/4g9XPfAgMBAAECggEABzAVBPm9XzMWvEH/BR8OMJ7Zoqd9tQaYiEkNn2bC7lhQ\ncfIFD23dipqZzd6SyD8JS/BqYLL04OxiyqMXJsGVNOUMb+D4vBFg1yPmuNlWSnCK\nP/uTPjYBJ5A1Z3wvNPcic1oZBQvIr3QoPcWDEsYNUFeCnsn8vEbZZzemmtNyZO+8\nrtLSao31KVUPwJ8nTFwuj0ccPMf2gyoUmRiMmvYL131dplgi1dEWjRuw3YbV7sCm\nY7YOM5dZGC4q8dSRTVRILS/nd4q8u3ryn9BJswd6UG8E9qT2654M5ycPfJiLUQge\nFFpBqtcldcT4R/l6DBcqcnXWUkrCcbIAP2j8Vf0eIQKBgQDsdnlAgusFOo2gmR6R\nGqmHTEIswYubQc7n/0bOl5BIqf6C1uyt/Xubs9IFjz+gyOkhGKHHs4cZRkNHsPIc\neb6tMITm9EHsVG6/KeOHTGLQ1XdCV1OVP/0eHTn9Oxf1Tdvi7YDbs5hfzlk+ptd/\nSJI9pd+2JMVdn3IwEHz+/TfE/wKBgQC6tOX42KKaBznfUn0s+XFzPHVjmg7FU+M4\nDf0DQrMBxI9Mi+mcPSkljPd2E+N4w5uX/BKwLsz5IfGPJPVtj0ADuS52aY4jpH+t\nxqwZG1z86gD6Yig0aC8RAkogE6ddxkhaRJH9H2wOb8VNxk1dWSzAF/cyg4yspBDB\nrGVHrq/xIQKBgQC49C4BHKWxcEwo6rty6fTiI+66zSRiawXohs6edwRfIcA2HOAB\nc3yEnBFRUeuF2sAmp/qaljy8sy2a3LdzOHLBSmsZrsIFlUEOezhBsqi0CdP/awiw\ne92C+X9LKDakI6MzC2w37HDptyAtFhkGsP/aAm1KLdbGVRneqHbsh6lghwKBgD5d\nXI/xtOakUUVyZVOXgrjOUhvSAusQ6U35BjGHnwmRIZidB4xjtZHQc3xiilH1bMyo\nq4lkKJ1zJB//ZWeSOPzFZ2qwOYVYVjmyqhu80yO7+lWoYeuXfVk+HYp3ZilhqRtV\n2jnlvA9acFpZSdBLkDIeDzk1TdEBAIPg1PfLtwNhAoGAQkRKhKmoIESBO/vYQaqe\nsb3N4a7Nr22wapjWX4lKr6avoYJDsVXJ6VAamw8DXYyZxdUrOCCuiwZaPPwC867o\nimWtt7Tm2aOL+w2z4wC+7od6zH87MgFY2aruCIckIPQDyLPXxFN8BgE9AomV6/o1\nm30RMdsky2XgCvP3y4fQFZ4=\n-----END PRIVATE KEY-----\n",
                "client_email": "codeo-stats@careful-airfoil-252908.iam.gserviceaccount.com",
                "client_id": "112493081467699767064",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/codeo-stats%40careful-airfoil-252908.iam.gserviceaccount.com"
            }
        }
    }
};
