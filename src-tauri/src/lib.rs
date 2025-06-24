#[tauri::command]
fn open_vscode(path: Option<String>) -> Result<(), String> {
    use std::process::Command;

    // Make sure works on all platforms
    let code_cmd = if cfg!(target_os = "windows") {
        "code.cmd"
    } else {
        "code"
    };

    let mut cmd = Command::new(code_cmd);

    if let Some(p) = path {
        cmd.arg(p);
    }

    cmd.spawn()
        .map_err(|e| format!("Failed to launch VS Code: {}", e))?;

    Ok(())
}

#[tauri::command]
fn get_git(path: String) -> Result<Option<String>, String> {
    use std::process::Command;

    let output = Command::new("git")
        .args(&["remote", "get-url", "origin"])
        .current_dir(path)
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                let url = String::from_utf8_lossy(&output.stdout).trim().to_string();
                Ok(Some(url))
            } else {
                // Git ran, but failed (e.g., not a Git repo)
                Ok(None)
            }
        }
        Err(_) => {
            // Git isn't installed or couldn't be executed
            Ok(None)
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_vscode])
        .invoke_handler(tauri::generate_handler![get_git])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
