package com.aditi.moneymanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MoneymanagerApplication {

	public static void main(String[] args) {
		String activeProfile = System.getProperty("spring.profiles.active", "local");
		if (activeProfile.equals("local")) {
			Dotenv dotenv = Dotenv.configure()
					.ignoreIfMissing()
					.load();

			System.setProperty("DB_URL", dotenv.get("DB_URL"));
			System.setProperty("DB_USER", dotenv.get("DB_USER"));
			System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
			System.setProperty("JWT_KEY", dotenv.get("JWT_KEY"));
			System.setProperty("JWT_EXPIRY", dotenv.get("JWT_EXPIRY"));
		}

		SpringApplication.run(MoneymanagerApplication.class, args);
	}

}
