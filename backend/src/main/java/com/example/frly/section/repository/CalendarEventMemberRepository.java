package com.example.frly.section.repository;

import com.example.frly.section.model.CalendarEventMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarEventMemberRepository extends JpaRepository<CalendarEventMember, Long> {
    List<CalendarEventMember> findByEventId(Long eventId);
    List<CalendarEventMember> findByEventIdIn(java.util.Collection<Long> eventIds);
    void deleteByEventId(Long eventId);
}
