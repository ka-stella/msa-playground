package com.sample.memo_service.application.mapper;

import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.infrastructure.db.entity.MemoEntity;

public class MemoMapper {
    public static MemoEntity toEntity(Memo memo){
        return new MemoEntity(
                memo.getId(),
                memo.getTitle(),
                memo.getContent(),
                memo.getCreatedAt(),
                memo.getUpdatedAt()
        );
    }

    public static Memo toDomain(MemoEntity memoEntity){
        return new Memo(
                memoEntity.getId(),
                memoEntity.getTitle(),
                memoEntity.getContent(),
                memoEntity.getCreatedAt(),
                memoEntity.getUpdatedAt()
        );
    }
}
