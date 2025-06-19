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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_vscode])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
