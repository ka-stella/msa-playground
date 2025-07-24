package com.sample.memo_service.domain.repository;

import java.util.List;
import java.util.UUID;

import com.sample.memo_service.domain.model.History;

public interface HistoryRepository {
    List<History> findByMemoIdOrderByOccurredAtAsc(UUID memoId);
}
