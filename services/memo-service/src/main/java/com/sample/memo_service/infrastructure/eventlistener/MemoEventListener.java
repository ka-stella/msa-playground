package com.sample.memo_service.infrastructure.eventlistener;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.sample.memo_service.domain.event.MemoCreatedEvent;
import com.sample.memo_service.domain.event.MemoUpdatedEvent;
import com.sample.memo_service.infrastructure.db.entity.HistoryEntity;
import com.sample.memo_service.infrastructure.db.repository.JpaHistoryRepository;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Component
public class MemoEventListener {
    private final JpaHistoryRepository jpaHistoryRepository;

    /**
     * MemoCreatedEventをリッスンし、履歴を保存する
     */
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleMemoCreatedEvent(MemoCreatedEvent event){
        HistoryEntity historyEntity = new HistoryEntity(
            event.getMemoId(),
            event.getClass().getSimpleName(),
            null,
            event.getTitle(),
            null,
            event.getContent(),
            event.getOccurredAt()
        );
        jpaHistoryRepository.save(historyEntity);
        System.out.println("MemoCreatedEventが正常に処理されました。メモID:" + historyEntity.getMemoId());
    }

    /**
     * MemoUpdatedEventをリッスンし、履歴を保存する
     */
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleMemoUpdatedEvent(MemoUpdatedEvent event){
        HistoryEntity historyEntity = new HistoryEntity(
            event.getMemoId(),
            event.getClass().getSimpleName(),
            event.getOldTitle(),
            event.getNewTitle(),
            event.getOldContent(),
            event.getNewContent(),
            event.getOccurredAt()
        );
        jpaHistoryRepository.save(historyEntity);
        System.out.println("MemoUpdatedEventが正常に処理されました。メモID:" + historyEntity.getMemoId());
    }
}
