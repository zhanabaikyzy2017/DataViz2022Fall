package lda;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;


import java.nio.file.Files;
import java.nio.file.Paths;

public class DataClient 
{
	private static final String DATA_DIR ="data";
	
	public DataClient()
	{

	}
	
	public void downloadSummaries(int num) 
			throws IOException
	{
		if (num <= 0) 
		{ 
			num = Integer.MAX_VALUE; 
		}
		File userDir = new File(String.format("%s", DATA_DIR));
		userDir.mkdir();
		String multiLineFile = 
			String.format("./data/%s_all.txt", DATA_DIR);
		String singleLineFile = 
			String.format("./data/%s_all_single.txt", DATA_DIR);
		
		downloadSummariesToFile(multiLineFile,  num, true);
		downloadSummariesToFile(singleLineFile, num, false);
	}
	

	public void downloadSummariesToFile(String outFilename, 
			                         int n, boolean newLine) 
			                         throws IOException
	{
		PrintWriter out = new PrintWriter(outFilename);
		List <String>  data = Files.readAllLines(Paths.get("./sample_data/export_new.json"));
		
		for (String t: data)
		{
			if (newLine)
			{
				out.print(t.replace("\n", "") + "\n");
			}
			else
			{
				out.print(t.replace("\n", "") + " ");
			}
		}
		System.out.println(String.format(
				"Wrote %d summaries for to file %s.", 
				data.size(), outFilename));
		out.close();
	}

	
}
