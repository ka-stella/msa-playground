package com.sample.memo_service.infrastructure.db.repository;

import com.sample.memo_service.infrastructure.db.entity.HistoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaHistoryRepository extends JpaRepository<HistoryEntity, UUID> {
    List<HistoryEntity> findByMemoIdOrderByOccurredAtAsc(UUID memoId);
}
