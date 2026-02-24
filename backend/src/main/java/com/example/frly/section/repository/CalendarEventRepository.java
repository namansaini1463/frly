package com.example.frly.section.repository;

import com.example.frly.section.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findBySectionIdOrderByStartTimeAsc(Long sectionId);
}
