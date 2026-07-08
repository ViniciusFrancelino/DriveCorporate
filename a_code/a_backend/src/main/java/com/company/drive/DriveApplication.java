package com.company.drive;

import com.company.drive.config.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class DriveApplication {
    public static void main(String[] args) { SpringApplication.run(DriveApplication.class, args); }
}
