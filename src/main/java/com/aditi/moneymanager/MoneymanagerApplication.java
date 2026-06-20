package com.aditi.moneymanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableCaching
@CrossOrigin(origins = "http://localhost:3000")
public class MoneymanagerApplication {
	public static void main(String[] args) {
		String activeProfile = System.getProperty("spring.profiles.active", "local");

		if (activeProfile.equals("local")) {
			// Only executed locally
			Dotenv dotenv = Dotenv.configure()
					.ignoreIfMissing()
					.load();

			if (dotenv.get("DB_URL_LOCAL") != null)
				System.setProperty("DB_URL", dotenv.get("DB_URL_LOCAL"));
			if (dotenv.get("DB_USER") != null)
				System.setProperty("DB_USER", dotenv.get("DB_USER_LOCAL"));
			if (dotenv.get("DB_PASSWORD_LOCAL") != null)
				System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD_LOCAL"));
			if (dotenv.get("JWT_KEY") != null)
				System.setProperty("JWT_KEY", dotenv.get("JWT_KEY"));
			if (dotenv.get("JWT_EXPIRY") != null)
				System.setProperty("JWT_EXPIRY", dotenv.get("JWT_EXPIRY"));
		} else {
			System.setProperty("DB_URL", System.getenv("DB_URL"));
			System.setProperty("DB_USER", System.getenv("DB_USER"));
			System.setProperty("DB_PASSWORD", System.getenv("DB_PASSWORD"));
			System.setProperty("JWT_KEY", System.getenv("JWT_KEY"));
			System.setProperty("JWT_EXPIRY", System.getenv("JWT_EXPIRY"));
		}

		SpringApplication.run(MoneymanagerApplication.class, args);
	}
}