package com.sample.memo_service.infrastructure.db.repository;

import com.sample.memo_service.infrastructure.db.entity.MemoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaMemoRepository extends JpaRepository<MemoEntity, UUID> {
}
