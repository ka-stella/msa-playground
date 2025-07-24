package com.sample.memo_service.application;

import com.sample.memo_service.domain.event.MemoCreatedEvent;
import com.sample.memo_service.domain.event.MemoUpdatedEvent;
import com.sample.memo_service.domain.model.History;
import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.domain.repository.HistoryRepository;
import com.sample.memo_service.domain.repository.MemoRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class MemoService {
    private final MemoRepository memoRepository;
    private final HistoryRepository historyRepository;

    private final ApplicationEventPublisher eventPublisher;

    /**
     * 新規メモ作成ユースケース
     * @param title メモのタイトル
     * @param content メモの内容
     * @return 保存されたMemoオブジェクト
     */
    public Memo createMemo(String title, String content){
        Memo newMemo = Memo.create(title,content);
        Memo savedMemo = memoRepository.save(newMemo);
        
        eventPublisher.publishEvent(new MemoCreatedEvent(
            savedMemo.getId(),
            savedMemo.getTitle(),
            savedMemo.getContent()
        ));
        return savedMemo;
    }

    public List<Memo> getAllMemos(){
        return memoRepository.findAll();
    }

    public Optional<Memo> getMemoById(UUID id){
        return memoRepository.findById(id);
    }

    /**
     * メモ更新ユースケース
     * @param id 更新対象のID
     * @param title メモのタイトル
     * @param content メモの内容
     * @return 更新されたMemoオブジェクト
     */
    public Optional<Memo> updateMemo(UUID id, String newTitle, String newContent){
        Optional<Memo> existingMemoOptional = memoRepository.findById(id);

        if(existingMemoOptional.isPresent()){
            Memo memoToUpdate = existingMemoOptional.get();

            String oldTitle = memoToUpdate.getTitle();
            String oldContent = memoToUpdate.getContent();

            memoToUpdate.update(newTitle, newContent);
            Memo updatedMemo = memoRepository.save(memoToUpdate);

            eventPublisher.publishEvent(new MemoUpdatedEvent(
                updatedMemo.getId(),
                oldTitle,
                newTitle,
                oldContent,
                newContent
            ));
            return Optional.of(updatedMemo);
        }
        return Optional.empty();
    }

    /**
     * メモ削除ユースケース
     * @param id
     */
    public void deleteMemo(UUID id){
        memoRepository.deleteById(id);
    }

    /**
     * 指定の履歴を取得する
     * @param memoId
     * @return
     */
    @Transactional(readOnly = true)
    public List<History> getHistories(UUID memoId){
        return historyRepository.findByMemoIdOrderByOccurredAtAsc(memoId);
    }
}
