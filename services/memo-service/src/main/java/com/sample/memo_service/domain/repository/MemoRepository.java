package com.sample.memo_service.domain.repository;

import com.sample.memo_service.domain.model.Memo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MemoRepository {
    Memo save(Memo memo);
    Optional<Memo> findById(UUID id);
    List<Memo> findAll();
    void deleteById(UUID id);
}
