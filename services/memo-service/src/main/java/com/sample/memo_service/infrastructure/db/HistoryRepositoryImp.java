package com.sample.memo_service.infrastructure.db;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.sample.memo_service.application.mapper.HistoryMapper;
import com.sample.memo_service.domain.model.History;
import com.sample.memo_service.domain.repository.HistoryRepository;
import com.sample.memo_service.infrastructure.db.entity.HistoryEntity;
import com.sample.memo_service.infrastructure.db.repository.JpaHistoryRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class HistoryRepositoryImp implements HistoryRepository {
    private final JpaHistoryRepository jpaHistoryRepository;

    @Override
    public List<History> findByMemoIdOrderByOccurredAtAsc(UUID memoId){
        List<HistoryEntity> historyEntities = jpaHistoryRepository.findByMemoIdOrderByOccurredAtAsc(memoId);
        return historyEntities.stream()
            .map(HistoryMapper::toDomain)
            .collect(Collectors.toList()); 
    }
}
