package com.company.drive.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<?> notFound(ResourceNotFoundException e,HttpServletRequest r){return error(HttpStatus.NOT_FOUND,e.getMessage(),r);}
 @ExceptionHandler(com.company.drive.exception.AccessDeniedException.class) ResponseEntity<?> forbidden(com.company.drive.exception.AccessDeniedException e,HttpServletRequest r){return error(HttpStatus.FORBIDDEN,e.getMessage(),r);}
 @ExceptionHandler(AccessDeniedException.class) ResponseEntity<?> forbiddenSecurity(AccessDeniedException e,HttpServletRequest r){return error(HttpStatus.FORBIDDEN,"Acesso negado",r);}
 @ExceptionHandler(AuthenticationException.class) ResponseEntity<?> unauthorized(AuthenticationException e,HttpServletRequest r){return error(HttpStatus.UNAUTHORIZED,"E-mail ou senha inválidos",r);}
 @ExceptionHandler({BadRequestException.class, HttpMessageNotReadableException.class}) ResponseEntity<?> badRequest(Exception e,HttpServletRequest r){return error(HttpStatus.BAD_REQUEST,e.getMessage(),r);}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> invalid(MethodArgumentNotValidException e,HttpServletRequest r){String m=e.getBindingResult().getFieldErrors().stream().findFirst().map(x->x.getField()+": "+x.getDefaultMessage()).orElse("Dados inválidos");return error(HttpStatus.BAD_REQUEST,m,r);}
 @ExceptionHandler(MaxUploadSizeExceededException.class) ResponseEntity<?> max(MaxUploadSizeExceededException e,HttpServletRequest r){return error(HttpStatus.PAYLOAD_TOO_LARGE,"O arquivo deve ter no máximo 50MB",r);}
 @ExceptionHandler(Exception.class) ResponseEntity<?> generic(Exception e,HttpServletRequest r){return error(HttpStatus.INTERNAL_SERVER_ERROR,"Erro interno inesperado",r);}
 private ResponseEntity<Map<String,Object>> error(HttpStatus s,String m,HttpServletRequest r){return ResponseEntity.status(s).body(Map.of("timestamp",LocalDateTime.now(),"status",s.value(),"error",s.getReasonPhrase(),"message",m==null?s.getReasonPhrase():m,"path",r.getRequestURI()));}
}
