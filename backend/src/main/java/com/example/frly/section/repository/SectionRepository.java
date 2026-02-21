package com.example.frly.section.repository;

import com.example.frly.common.enums.RecordStatus;
import com.example.frly.section.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByStatusNotOrderByPositionAsc(RecordStatus status);

    java.util.List<Section> findByParentSectionIdAndStatusNot(Long parentId, RecordStatus status);
}
