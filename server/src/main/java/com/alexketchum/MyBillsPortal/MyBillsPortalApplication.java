package com.alexketchum.MyBillsPortal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class MyBillsPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyBillsPortalApplication.class, args);
	}

}
