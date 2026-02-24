package com.example.frly.section.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateCalendarEventRequestDto {
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String category;
    private java.util.List<Long> memberIds;
}
