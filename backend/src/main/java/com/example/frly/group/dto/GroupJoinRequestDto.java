package com.example.frly.group.dto;

import com.example.frly.group.enums.GroupMemberStatus;
import lombok.Data;

@Data
public class GroupJoinRequestDto {
    private Long memberId;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private GroupMemberStatus status;
}
