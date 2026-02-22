package com.example.frly.group.controller;

import com.example.frly.auth.AuthUtil;
import com.example.frly.group.dto.GroupInviteSummaryDto;
import com.example.frly.group.dto.InviteTokenRequestDto;
import com.example.frly.group.service.GroupInviteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
public class GroupInviteController {

    private final GroupInviteService groupInviteService;

    @PostMapping("/accept")
    public ResponseEntity<Void> acceptInvite(@RequestBody InviteTokenRequestDto request) {
        groupInviteService.acceptInvite(request.getToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/decline")
    public ResponseEntity<Void> declineInvite(@RequestBody InviteTokenRequestDto request) {
        groupInviteService.declineInvite(request.getToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{inviteId}/accept")
    public ResponseEntity<Void> acceptInviteById(@PathVariable Long inviteId) {
        Long userId = AuthUtil.getCurrentUserId();
        groupInviteService.acceptInviteById(inviteId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{inviteId}/decline")
    public ResponseEntity<Void> declineInviteById(@PathVariable Long inviteId) {
        Long userId = AuthUtil.getCurrentUserId();
        groupInviteService.declineInviteById(inviteId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mine")
    public ResponseEntity<List<GroupInviteSummaryDto>> getMyInvites() {
        Long userId = AuthUtil.getCurrentUserId();
        return ResponseEntity.ok(groupInviteService.getInvitesForUser(userId));
    }
}
