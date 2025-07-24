package com.sample.memo_service.presentation.controller;

import com.sample.memo_service.application.MemoService;
import com.sample.memo_service.domain.model.History;
import com.sample.memo_service.domain.model.Memo;
import com.sample.memo_service.presentation.dto.memo.MemoRequest;
import com.sample.memo_service.presentation.dto.memo.MemoResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class MemoWebSocketController {
    private final MemoService memoService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/memos.getAll")
    @SendTo("/topic/memos.getAll")
    public List<MemoResponse> getAllMemosViaWebSocket() {
        List<Memo> memos = memoService.getAllMemos();
        return memos.stream()
                .map(MemoResponse::new)
                .collect(Collectors.toList());
    }

    @MessageMapping("/memos.getById")
    @SendTo("/topic/memos.getById")
    public MemoResponse getMemoByIdViaWebSocket(@Payload UUID id) {  
        return memoService.getMemoById(id)
                .map(MemoResponse::new)
                .orElse(null);
    }

    @MessageMapping("/memos.create")
    public void createMemoViaWebSocket(@Payload MemoRequest request) {
        Memo createdMemo = memoService.createMemo(request.getTitle(), request.getContent());

        // 個別のトピックに送信
        messagingTemplate.convertAndSend("/topic/memos.created", new MemoResponse(createdMemo));

        // 全てのメモをトピックに送信
        List<Memo> allMemos = memoService.getAllMemos();
        List<MemoResponse> allMemoResponses = allMemos.stream()
            .map(MemoResponse::new)
            .collect(Collectors.toList());
        messagingTemplate.convertAndSend("/topic/memos.getAll", allMemoResponses);
    }

    @MessageMapping("/memos.update")
    @SendTo("/topic/memos.update")
    public MemoResponse updateMemoViaWebSocket(@Payload MemoRequest request) {
        UUID id = request.getId();
        Memo updatedMemo = memoService.updateMemo(request.getId(), request.getTitle(), request.getContent())
                .orElseThrow(() -> new IllegalArgumentException("Memo not found for update: " + id));
        return new MemoResponse(updatedMemo);
    }

    @MessageMapping("/memos.delete")
    public void deleteMemoViaWebSocket(@Payload UUID id) {
        memoService.deleteMemo(id);

        // 削除されたIDを通知
        messagingTemplate.convertAndSend("/topic/memos.deleted", id);

        // 全てのメモをトピックに送信
        List<Memo> allMemos = memoService.getAllMemos();
        List<MemoResponse> allMemoResponses = allMemos.stream()
            .map(MemoResponse::new)
            .collect(Collectors.toList());
        messagingTemplate.convertAndSend("/topic/memos.getAll",allMemoResponses);
    }

    @MessageMapping("/memos.getHistories")
    @SendTo("/topic/memos.getHistories")
    public List<History> getHistoriesViaWebSocket(@Payload UUID id) {
        return memoService.getHistories(id);
    }
}
