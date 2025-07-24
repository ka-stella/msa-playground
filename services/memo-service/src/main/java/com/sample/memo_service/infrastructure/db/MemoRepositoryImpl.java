package com.sample.memo_service.infrastructure.db;

import com.sample.memo_service.application.mapper.MemoMapper;
import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.domain.repository.MemoRepository;
import com.sample.memo_service.infrastructure.db.entity.MemoEntity;
import com.sample.memo_service.infrastructure.db.repository.JpaMemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class MemoRepositoryImpl implements MemoRepository {

    private final JpaMemoRepository jpaMemoRepository;

    @Override
    public Memo save(Memo memo) {
        MemoEntity memoEntity = MemoMapper.toEntity(memo);
        MemoEntity savedEntity = jpaMemoRepository.save(memoEntity);
        return MemoMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Memo> findById(UUID id) {
        return jpaMemoRepository.findById(id)
                .map(MemoMapper::toDomain);
    }

    @Override
    public List<Memo> findAll() {
        return jpaMemoRepository.findAll().stream()
                .map(MemoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaMemoRepository.deleteById(id);
    }
}
